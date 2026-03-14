function HistoryList({ history }) {
  return (
    <section className="card">
      <div className="section-heading">
        <p className="eyebrow">History</p>
        <h2>Recent predictions</h2>
      </div>

      <div className="history-list">
        {history.length ? (
          history.map((item, index) => (
            <article key={`${item.timestamp}-${index}`} className="history-item">
              <div>
                <strong>{item.sentiment}</strong>
                <p>{item.text}</p>
              </div>
              <span>{item.confidence}%</span>
            </article>
          ))
        ) : (
          <p className="muted-text">Run an analysis to populate the dashboard history.</p>
        )}
      </div>
    </section>
  );
}

export default HistoryList;
