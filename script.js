// API Key akan dimuat dari environment atau config
let apiKey = null;
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

let qaData = []; // Array untuk menyimpan data pertanyaan dan jawaban
let flag = 0;
let initialMessageSent = false; // Flag untuk mengecek apakah pesan awal sudah dikirim

// Fungsi untuk memuat API key dari environment atau config
async function loadApiKey() {
  try {
    // Coba ambil dari environment variables (untuk production)
    if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
      return;
    }
    
    // Fallback: coba ambil dari file config (untuk development)
    const response = await fetch("main.properties");
    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('OPENAI_API_KEY=')) {
        apiKey = line.split('=')[1].trim();
        if (apiKey === 'your_openai_api_key_here') {
          apiKey = null; // Reset jika masih placeholder
        }
        break;
      }
    }
  } catch (error) {
    console.warn("Tidak dapat memuat API key:", error);
    apiKey = null;
  }
}

// Fungsi untuk validasi dan sanitasi input
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return { isValid: false, message: "Input tidak valid" };
  }
  
  // Trim whitespace
  const trimmed = input.trim();
  
  // Cek panjang input
  if (trimmed.length === 0) {
    return { isValid: false, message: "Pesan tidak boleh kosong" };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, message: "Pesan terlalu panjang (maksimal 1000 karakter)" };
  }
  
  // Sanitasi HTML tags
  const sanitized = trimmed.replace(/<[^>]*>/g, '');
  
  // Cek karakter berbahaya
  const dangerousPatterns = /[<>\"'&]/g;
  if (dangerousPatterns.test(sanitized)) {
    return { isValid: false, message: "Input mengandung karakter yang tidak diizinkan" };
  }
  
  return { isValid: true, message: sanitized };
}

// Fungsi untuk memuat data dari file TXT
async function loadQAData() {
  try {
    const response = await fetch("tuning.txt"); // Memuat file TXT
    const text = await response.text();
    const entries = text.trim().split("\n"); // Memisahkan berdasarkan baris

    // Memproses setiap entri ke dalam array qaData
    for (let i = 0; i < entries.length; i += 2) {
      const prompt = entries[i].trim();
      const completion = entries[i + 1]?.trim();
      if (prompt && completion) {
        qaData.push({ prompt, completion });
      }
    }
  } catch (error) {
    console.error("Error loading QA data:", error);
  }
}

// Fungsi untuk menambahkan pesan ke chat
function addMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll ke bawah
}

// Fungsi untuk mencari jawaban
function findAnswer(question) {
  const lowerQuestion = question.toLowerCase(); // Konversi pertanyaan ke huruf kecil
  for (let i = 0; i < qaData.length; i++) {
    if (lowerQuestion.includes(qaData[i].prompt.toLowerCase())) { // Perbandingan case-insensitive
      return qaData[i].completion;
    }
  }
  return null; // Kembalikan null jika tidak ditemukan
}


// Fungsi untuk meminta jawaban dari ChatGPT
async function fetchChatGPTAnswer(question) {
  // Cek apakah API key tersedia
  if (!apiKey) {
    return "Maaf, layanan ChatGPT sedang tidak tersedia. Untuk sementara silahkan bertanya mengenai aplikasi Better Me";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        return "API key tidak valid. Silakan hubungi administrator.";
      } else if (response.status === 429) {
        return "Terlalu banyak permintaan. Silakan coba lagi nanti.";
      } else if (response.status === 500) {
        return "Server sedang mengalami masalah. Silakan coba lagi nanti.";
      } else {
        return `Error: ${response.status} - ${errorData.error?.message || 'Terjadi kesalahan pada server'}`;
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return "Format respons tidak valid dari server.";
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    }
    
    return "Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.";
  }
}

// Fungsi untuk menampilkan loading state yang lebih informatif
function showLoadingState(message) {
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot", "loading");
  loadingDiv.innerHTML = `
    <div class="loading-content">
      <span class="loading-dots">${message}</span>
      <div class="loading-animation">...</div>
    </div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return loadingDiv;
}

// Fungsi untuk mengirim pesan
sendButton.addEventListener("click", async () => {
  const rawInput = userInput.value;
  
  // Validasi input
  const validation = validateInput(rawInput);
  if (!validation.isValid) {
    addMessage(`❌ ${validation.message}`, "bot");
    return;
  }

  const userMessage = validation.message;
  
  // Disable input sementara
  userInput.disabled = true;
  sendButton.disabled = true;

  addMessage(userMessage, "user");
  userInput.value = "";

  if (!initialMessageSent) {
    // Pesan awal hanya dikirim sekali
    addMessage("Hello! Welcome to Better Me! I'm Better Bot, ready to help you with your health and wellness journey! 🦁", "bot");
    initialMessageSent = true;
    
    // Re-enable input
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    return;
  }

  // Cari jawaban di database lokal
  const localAnswer = findAnswer(userMessage);

  if (localAnswer) {
    // Jika jawaban ditemukan di file TXT
    showLoadingState("Mencari jawaban di database lokal...");
    setTimeout(() => {
      chatMessages.lastChild.textContent = localAnswer;
      chatMessages.lastChild.classList.remove("loading");
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Re-enable input
      userInput.disabled = false;
      sendButton.disabled = false;
      userInput.focus();
    }, 500);
  } else {
    // Jika tidak ditemukan, arahkan ke ChatGPT
    const loadingDiv = showLoadingState("Mencari jawaban dari AI...");
    
    try {
      const gptAnswer = await fetchChatGPTAnswer(userMessage);
      loadingDiv.textContent = gptAnswer;
      loadingDiv.classList.remove("loading");
    } catch (error) {
      loadingDiv.textContent = "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
      loadingDiv.classList.remove("loading");
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Re-enable input
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
});

// Kirim pesan saat Enter ditekan
userInput.addEventListener("keypress", event => {
  if (event.key === "Enter") sendButton.click();
});

// Inisialisasi aplikasi
async function initializeApp() {
  try {
    // Memuat API key terlebih dahulu
    await loadApiKey();
    
    // Memuat data pertanyaan dan jawaban
    await loadQAData();
    
    // Tampilkan status API key
    if (apiKey) {
      console.log("✅ API key berhasil dimuat");
    } else {
      console.warn("⚠️ API key tidak ditemukan. Fitur ChatGPT tidak akan tersedia.");
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// Memulai aplikasi saat halaman dimuat
initializeApp();
