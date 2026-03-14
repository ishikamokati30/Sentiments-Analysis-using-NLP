from services.sentiment_service import SentimentService


if __name__ == "__main__":
    service = SentimentService()
    sample = "I absolutely loved this movie. It was engaging and uplifting."
    print(service.predict(sample))
