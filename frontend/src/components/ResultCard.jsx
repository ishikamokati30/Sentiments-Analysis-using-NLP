function ResultCard({ result }) {
  if (!result) {
    return (
      <article className="result-card neutral">
        <h3>Result</h3>
        <p>No analysis yet</p>
      </article>
    );
  }

  const toneClass = result.sentiment === "positive" ? "positive" : "negative";

  return (
    <article className={`result-card ${toneClass}`}>
      <h3>Result</h3>
      {result && <p className="result-meta">Sentiment: <span className="sentiment-badge">{result.sentiment}</span></p>}
    </article>
  );
}

export default ResultCard;
