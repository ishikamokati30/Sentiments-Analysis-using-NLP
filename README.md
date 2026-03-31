# Sentiment Analysis Web App

A full-stack web application that analyzes user input text and classifies it as **Positive** or **Negative** using Natural Language Processing (NLP).

---

## 🚀 Features

- 🔍 Real-time sentiment analysis
- ⚡ Fast and lightweight (Node.js-based, no Python/Flask)
- 🎯 Simple and clean UI
- 🌐 REST API integration

---

## 🏗️ Tech Stack

### Frontend

- React (Vite)
- Axios

### Backend

- Node.js
- Express.js
- Sentiment (NPM NLP library)

---

## 📂 Project Structure

```
Sentiment_Analysis/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ishikamokati30/Sentiments-Analysis-using-NLP.git
cd Sentiments-Analysis-using-NLP
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:4000
```

---

### 3️⃣ Setup Frontend

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📡 API Endpoint

### POST `/analyze`

#### Request:

```json
{
  "text": "I love this project"
}
```

#### Response:

```json
{
  "sentiment": "positive"
}
```

---

## 🧠 How It Works

- User inputs text from frontend
- Request is sent to Node.js backend
- Backend analyzes sentiment using NLP library
- Result is returned and displayed

---

## 🔄 Recent Updates

- ❌ Removed Flask (Python backend)
- ✅ Implemented Node.js-based sentiment analysis
- ✅ Simplified architecture

---

## 📌 Future Improvements

- Add emotion detection (happy, angry, sad)
- Add confidence score
- Add word-level explainability
- Dashboard with sentiment trends

---

## 👩‍💻 Author

**Ishika Mokati**

---

## ⭐ Contribute

Feel free to fork the repo and submit pull requests!

---
