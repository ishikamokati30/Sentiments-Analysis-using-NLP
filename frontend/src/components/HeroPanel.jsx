function HeroPanel({ stats }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">AI Sentiment Analytics</p>
        <h2>Analyze reviews across sentiment, emotions, aspects, sarcasm, and spam risk</h2>
        <p>
          The upgraded analyzer keeps the original positive/negative workflow, but now adds multilingual scoring,
          explainability, model comparison, and analytics-ready history.
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
          <span>Flagged risk</span>
          <strong>{stats.risky}</strong>
        </article>
      </div>
    </section>
  );
}

export default HeroPanel;
