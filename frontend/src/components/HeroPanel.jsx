function HeroPanel({ stats }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Sentiment analyzer</p>
        <h2>Analyze text and return a simple positive or negative result</h2>
        <p>
          Submit text to the backend and review the latest sentiment response without
          extra analytics or model metadata.
        </p>
      </div>

      <div className="metric-strip">
        <article className="metric-card">
          <span>Total analyses</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="metric-card">
          <span>Positive</span>
          <strong>{stats.positives}</strong>
        </article>
        <article className="metric-card">
          <span>Negative</span>
          <strong>{stats.negatives}</strong>
        </article>
      </div>
    </section>
  );
}

export default HeroPanel;
