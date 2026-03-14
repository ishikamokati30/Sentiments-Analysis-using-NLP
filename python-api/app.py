from flask import Flask, jsonify, request
from flask_cors import CORS

from services.sentiment_service import SentimentService


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    sentiment_service = SentimentService()

    @app.get("/")
    def home():
        return jsonify(
            {
                "message": "Sentiment Analysis API is running",
                "modelStatus": "ready",
            }
        )

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.post("/predict")
    def predict():
        payload = request.get_json(silent=True) or {}
        text = payload.get("text", "")

        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "A non-empty 'text' field is required."}), 400

        try:
            result = sentiment_service.predict(text)
            return jsonify(result)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        except Exception:
            app.logger.exception("Prediction failed")
            return jsonify({"error": "Prediction failed due to an internal error."}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
