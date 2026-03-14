<<<<<<< HEAD
<<<<<<< HEAD
# Sentiment Analysis Platform

Full-stack sentiment analysis project using a scikit-learn SVM model, Flask inference API, Express proxy backend, and a React analytics frontend.

## Folder structure

```text
sentiment-analysis-platform
|-- ml-model
|   |-- sentiment_model.pkl
|   `-- vectorizer.pkl
|-- python-api
|   |-- app.py
|   |-- requirements.txt
|   |-- services
|   |   `-- sentiment_service.py
|   `-- utils
|       `-- preprocessing.py
|-- backend
|   |-- package.json
|   `-- server.js
`-- frontend
    |-- package.json
    |-- vite.config.js
    `-- src
```

## Run commands

### 1. Flask API

```bash
cd python-api
pip install -r requirements.txt
flask --app app run --debug --port 5000
```

### 2. Express backend

```bash
cd backend
npm install
npm run dev
```

### 3. React frontend

```bash
cd frontend
npm install
npm run dev
```

## API flow

`React -> Express (/analyze) -> Flask (/predict) -> sklearn model`
=======
# Sentiments-Analysis-using-NLP
>>>>>>> 7bc2ec463f57e9e04672a5e42e6905f0c2ca5720
=======
# Sentiment Analysis using NLP

This project implements a full-stack sentiment analysis system using:

- React frontend
- Node.js backend
- Flask ML API
- TF-IDF + SVM model

Architecture:

React → Express
>>>>>>> fb01d6576a9c2c2a7e4950840d677d6362f1ea90
