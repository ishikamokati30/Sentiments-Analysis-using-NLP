from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import numpy as np

from utils.preprocessing import clean_text


class SentimentService:
    def __init__(self) -> None:
        root_dir = Path(__file__).resolve().parents[2]
        model_dir = root_dir / "ml-model"

        self.model = joblib.load(model_dir / "sentiment_model.pkl")
        self.vectorizer = joblib.load(model_dir / "vectorizer.pkl")

    def predict(self, text: str) -> dict[str, Any]:
        cleaned_text = clean_text(text)
        if not cleaned_text:
            raise ValueError("Text must contain at least one alphabetic token after preprocessing.")

        vector = self.vectorizer.transform([cleaned_text])
        prediction = self.model.predict(vector)[0]

        sentiment = "Positive" if int(prediction) == 1 else "Negative"
        confidence = self._get_confidence(vector, prediction)

        return {
            "text": text,
            "cleanedText": cleaned_text,
            "sentiment": sentiment,
            "confidence": round(confidence, 2),
        }

    def _get_confidence(self, vector: Any, prediction: Any) -> float:
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(vector)[0]
            return float(np.max(probabilities) * 100)

        if hasattr(self.model, "decision_function"):
            distance = self.model.decision_function(vector)
            distance_value = float(distance[0] if np.ndim(distance) else distance)
            scaled = 1 / (1 + np.exp(-abs(distance_value)))
            return float(scaled * 100)

        return 100.0 if int(prediction) == 1 else 50.0
