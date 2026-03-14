function ResultCard({ result }) {
  if (!result) {
    return (
      <article className="result-card neutral">
        <h3>Latest result</h3>
        <p>No analysis yet.</p>
      </article>
    );
  }

  const toneClass = result.sentiment === "Positive" ? "positive" : "negative";

  return (
    <article className={`result-card ${toneClass}`}>
      <h3>Latest result</h3>
      <p className="sentiment-badge">{result.sentiment}</p>
      <p className="result-meta">Confidence: {result.confidence}%</p>
      <p className="result-meta">Processed text: {result.cleanedText}</p>
    </article>
  );
}

export default ResultCard;
