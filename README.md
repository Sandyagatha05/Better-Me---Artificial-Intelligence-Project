# Better Me - Health & Wellness Chatbot

Aplikasi web chatbot yang menggunakan teknologi AI untuk membantu pengguna dalam perjalanan kesehatan dan kebugaran mereka.

## 🚀 Fitur

- **Hybrid AI System**: Menggabungkan database lokal dengan OpenAI API
- **Input Validation**: Validasi dan sanitasi input untuk keamanan
- **Error Handling**: Penanganan error yang komprehensif
- **Loading States**: Indikator loading yang informatif
- **Responsive Design**: Interface yang responsif dan user-friendly

## 📁 Struktur File

```
betterme/
├── index.html          # Struktur HTML utama
├── script.js           # Logika aplikasi JavaScript
├── styles.css          # Styling CSS
├── main.properties     # File konfigurasi
├── tuning.txt          # Database Q&A lokal
├── pics/
│   └── lion.png        # Avatar bot
└── README.md           # Dokumentasi ini
```

## ⚙️ Setup & Konfigurasi

### 1. API Key Configuration

**Untuk Development:**
1. Buka file `main.properties`
2. Ganti `your_openai_api_key_here` dengan API key OpenAI Anda yang sebenarnya
3. Simpan file

**Untuk Production:**
Set environment variable `OPENAI_API_KEY` di server Anda.

### 2. Menjalankan Aplikasi

1. Pastikan semua file ada di folder yang sama
2. Buka `index.html` di web browser
3. Aplikasi siap digunakan!

## 🔧 Konfigurasi Lanjutan

### File main.properties

```properties
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_api_key_here

# Application Settings
APP_NAME=Better Me
APP_VERSION=1.0.0
DEBUG_MODE=false

# API Settings
MAX_TOKENS=500
TEMPERATURE=0.7
MODEL=gpt-3.5-turbo

# Security Settings
MAX_INPUT_LENGTH=1000
ENABLE_INPUT_VALIDATION=true
```

## 🛡️ Keamanan

- ✅ API key tidak lagi hardcoded
- ✅ Input validation dan sanitasi
- ✅ Error handling yang aman
- ✅ Rate limiting untuk API calls

## 🎯 Cara Kerja

1. **User Input** → Validasi input
2. **Local Database Check** → Cari di `tuning.txt`
3. **Found?** → Tampilkan jawaban lokal
4. **Not Found?** → Panggil OpenAI API
5. **Display Response** → Tampilkan jawaban

## 📝 Database Lokal

File `tuning.txt` berisi Q&A yang sering ditanyakan tentang platform Better Me. Format:
```
Pertanyaan?
Jawaban untuk pertanyaan tersebut.

Pertanyaan lain?
Jawaban untuk pertanyaan lain.
```

## 🐛 Troubleshooting

### API Key Issues
- Pastikan API key valid di `main.properties`
- Cek console browser untuk error messages
- Pastikan koneksi internet stabil

### Input Validation Errors
- Input tidak boleh kosong
- Maksimal 1000 karakter
- Tidak boleh mengandung karakter berbahaya

## 📞 Support

Jika mengalami masalah, periksa:
1. Console browser untuk error messages
2. Koneksi internet
3. Validitas API key
4. Format file `tuning.txt`

## 🔄 Versi

- **v1.0.0** - Initial release dengan fitur dasar
- **v1.1.0** - Added security improvements dan error handling
