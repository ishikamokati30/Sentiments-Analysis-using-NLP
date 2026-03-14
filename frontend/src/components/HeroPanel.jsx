function HeroPanel({ stats }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Portfolio-ready AI application</p>
        <h2>Operational sentiment scoring with an analytics-first interface</h2>
        <p>
          Use the analyzer to classify text through the trained SVM pipeline, then review
          aggregate sentiment movement on the dashboard.
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
