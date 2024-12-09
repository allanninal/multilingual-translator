
# Multilingual Translator

The Multilingual Translator leverages Hugging Face’s **Helsinki-NLP/opus-mt** models to translate text between multiple languages effortlessly. Built with a **ReactJS (Vite)** frontend and a **Flask** backend, this tool provides real-time translations through an interactive interface.

---

## Features

- **Dynamic Language Support**: Translate text between various language pairs using Hugging Face models.
- **Real-Time Results**: Translations are generated instantly for a seamless user experience.
- **User-Friendly Interface**: Built with ReactJS for responsive and intuitive interaction.
- **Customizable**: Open-source and extendable for specific needs or additional features.

---

## Tech Stack

### **Frontend**
- ReactJS with Vite for a fast and responsive UI.
- Axios for API communication.

### **Backend**
- Flask for handling API requests and processing translations.
- Hugging Face’s **Helsinki-NLP/opus-mt** for accurate multilingual translation.

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone git@github.com:allanninal/multilingual-translator.git
cd multilingual-translator
```

### 2. Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Install dependencies using `requirements.txt` from the backend folder:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the Flask backend:
   ```bash
   python backend/app.py
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

Visit the app at `http://localhost:5173`.

---

## How It Works

1. **Input Text**: Enter the text and specify the source and target languages.
2. **Backend Processing**: Flask processes the input and uses Hugging Face’s `Helsinki-NLP/opus-mt` models for translation.
3. **Display Results**: The frontend displays the translated text in real-time.

---

## Future Enhancements

1. **Speech Integration**: Add text-to-speech and speech-to-text capabilities for audio translations.
2. **Language Dropdowns**: Replace text input fields with dropdown menus for easy language selection.
3. **Save Translations**: Allow users to save translated text locally or in the cloud.
4. **Enhanced UI/UX**: Add progress indicators and polished designs for better user experience.
5. **Offline Support**: Enable limited offline translations by hosting specific language models locally.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

If you find this project helpful, consider supporting me on Ko-fi:  
[ko-fi.com/allanninal](https://ko-fi.com/allanninal)

---

## Explore More Projects

For more exciting projects, check out my list of **AI Mini Projects**:  
[Mini AI Projects GitHub List](https://github.com/stars/allanninal/lists/mini-ai-projects)
