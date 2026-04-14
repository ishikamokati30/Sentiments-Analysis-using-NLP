function ConfidenceMeter({ score = 0 }) {
  const percentage = ((Number(score) + 1) / 2) * 100;

  return (
    <div>
      <div className="meter-header">
        <span>Sentiment score</span>
        <strong>{Number(score).toFixed(2)}</strong>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="meter-scale">
        <span>-1</span>
        <span>neutral</span>
        <span>+1</span>
      </div>
    </div>
  );
}

export default ConfidenceMeter;
