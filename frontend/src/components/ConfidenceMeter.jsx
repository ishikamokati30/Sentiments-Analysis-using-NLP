function ConfidenceMeter({ result }) {
  const confidence = result?.confidence || 0;

  return (
    <article className="result-card meter-card">
      <h3>Confidence meter</h3>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${Math.min(confidence, 100)}%` }} />
      </div>
      <p className="result-meta">{confidence}% model confidence</p>
    </article>
  );
}

export default ConfidenceMeter;
