# Better Me - Health & Wellness Chatbot

A web-based chatbot application that use AI technology to support users in their health and wellness journey.

## 🚀 Features

- **Hybrid AI System**: Combines a local database with the OpenAI API
- **Input Validation**: Input validation for security
- **Error Handling**: Comprehensive error management
- **Loading States**: Informative loading indicators
- **Responsive Design**: User-friendly and responsive interface

## 📁 File Structure

```
betterme/
├── index.html          # Main HTML structure
├── script.js           # Application logic in JavaScript
├── styles.css          # CSS styling
├── main.properties     # Configuration file
├── tuning.txt          # Local Q&A database
├── pics/
│   └── lion.png        # Bot avatar
└── README.md           # This documentation
```

## ⚙️ Setup & Configuration

### 1. API Key Configuration

**For Development:**
1. Open the `main.properties` file
2. Replace `your_openai_api_key_here` with your actual OpenAI API key
3. Save the file

**For Production:**
Set the environment variable `OPENAI_API_KEY` on your server.

### 2. Running the Application

1. Ensure all files are located in the same folder
2. Open `index.html` in a browser web
3. The application is ready to use!

## 🔧 Advanced Configuration

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

## 🎯 How it Works

1. **User Input** → Validate input
2. **Local Database Check** → Search in `tuning.txt`
3. **Found?** → Display local answer
4. **Not Found?** → Call OpenAI API
5. **Display Response** → Show the answer

## 📝 Local Database

The `tuning.txt` file contains frequently asked Q&A about the Better Me platform. Format:
```
Question?
Answer to that question.

Question?
Answer to that question.
```

## 🐛 Troubleshooting

### API Key Issues
- Ensure the API key is valid in `main.properties`
- Check the browser console for error messages
- Make sure your internet connection is stable

### Input Validation Errors
- Input must not be empty
- Maximum 1000 characters
- No harmful characters allowed

## 📞 Support

If you encounter issues, check:
1. Browser console for error messages
2. Internet connection
3. API key validity
4. Format of the `tuning.txt` file

