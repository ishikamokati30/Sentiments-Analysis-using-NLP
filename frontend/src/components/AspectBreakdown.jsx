function AspectBreakdown({ aspects }) {
  if (!aspects?.length) {
    return <p className="muted-text">No aspect cues found in this text.</p>;
  }

  return (
    <div className="aspect-grid">
      {aspects.map((aspect) => (
        <article key={aspect.aspect} className="aspect-card">
          <div className="aspect-topline">
            <strong>{aspect.aspect}</strong>
            <span className={`sentiment-badge tone-${aspect.sentiment}`}>{aspect.sentiment}</span>
          </div>
          <p>Score: {aspect.score.toFixed(2)}</p>
          <p>Signals: {aspect.evidence.join(", ")}</p>
        </article>
      ))}
    </div>
  );
}

export default AspectBreakdown;
