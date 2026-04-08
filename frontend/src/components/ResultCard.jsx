function ResultCard({ result }) {
  if (!result) {
    return (
      <article className="result-card neutral">
        <h3>Result</h3>
        <p>No analysis yet</p>
      </article>
    );
  }

  const toneClass =
    result.sentiment === "positive"
      ? "positive"
      : result.sentiment === "negative"
        ? "negative"
        : "neutral";

  return (
    <article className={`result-card ${toneClass}`}>
      <h3>Result</h3>
      <p className="result-meta">
        Sentiment: <span className="sentiment-badge">{result.sentiment}</span>
      </p>
      <p className="result-meta">
        Mood: <span className="sentiment-badge">{result.mood}</span>
      </p>
    </article>
  );
}

export default ResultCard;
