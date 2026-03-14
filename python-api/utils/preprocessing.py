from __future__ import annotations

import re


STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
}


def clean_text(text: str) -> str:
    normalized = text.lower()
    normalized = re.sub(r"http\S+|www\.\S+", " ", normalized)
    normalized = re.sub(r"[^a-z\s]", " ", normalized)
    tokens = [token for token in normalized.split() if token and token not in STOP_WORDS]
    return " ".join(tokens)
