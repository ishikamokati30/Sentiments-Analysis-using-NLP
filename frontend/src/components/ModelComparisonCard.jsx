function MetricRow({ label, value }) {
  return (
    <div className="metric-inline">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModelComparisonCard({ comparison }) {
  if (!comparison) {
    return null;
  }

  const rows = [
    ["Rule-based", comparison.ruleBased],
    ["ML model", comparison.mlModel],
    ["Transformer", comparison.transformerModel],
  ];

  return (
    <section className="card">
      <div className="section-heading">
        <p className="eyebrow">Model Comparison</p>
        <h2>Estimated benchmark snapshot</h2>
      </div>

      <div className="comparison-grid">
        {rows.map(([label, metrics]) => (
          <article key={label} className="comparison-card">
            <h3>{label}</h3>
            <MetricRow label="Accuracy" value={metrics?.accuracy ?? 0} />
            <MetricRow label="Precision" value={metrics?.precision ?? 0} />
            <MetricRow label="Recall" value={metrics?.recall ?? 0} />
            <MetricRow label="Samples" value={metrics?.sampleSize ?? 0} />
          </article>
        ))}
      </div>

      <div className="matrix-grid">
        {rows.map(([label, metrics]) => (
          <article key={`${label}-matrix`} className="matrix-card">
            <h3>{label} confusion matrix</h3>
            <table>
              <thead>
                <tr>
                  <th>Actual \ Pred</th>
                  <th>Positive</th>
                  <th>Neutral</th>
                  <th>Negative</th>
                </tr>
              </thead>
              <tbody>
                {["positive", "neutral", "negative"].map((actual) => (
                  <tr key={actual}>
                    <td>{actual}</td>
                    <td>{metrics?.confusionMatrix?.[actual]?.positive ?? 0}</td>
                    <td>{metrics?.confusionMatrix?.[actual]?.neutral ?? 0}</td>
                    <td>{metrics?.confusionMatrix?.[actual]?.negative ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>

      <p className="muted-text">{comparison.note}</p>
    </section>
  );
}

export default ModelComparisonCard;
