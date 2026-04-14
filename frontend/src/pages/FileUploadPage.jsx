import { useState } from "react";

import { batchAnalyzeCsv, fetchAnalytics } from "../api/sentimentApi";

function FileUploadPage({ onBatchAppend, onAnalyticsRefresh }) {
  const [fileName, setFileName] = useState("");
  const [batchResult, setBatchResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const csvContent = await file.text();
      const response = await batchAnalyzeCsv(csvContent);

      setFileName(file.name);
      setBatchResult(response);
      onBatchAppend((current) => [...response.results, ...current].slice(0, 100));
      onAnalyticsRefresh(await fetchAnalytics());
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || "Batch upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid">
      <div className="card analyzer-card">
        <div className="section-heading">
          <p className="eyebrow">Batch Processing</p>
          <h2>Upload a CSV file for bulk sentiment analysis</h2>
        </div>

        <label className="upload-panel">
          <span>{fileName || "Choose CSV file"}</span>
          <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
        </label>

        <p className="helper-text">Expected first column or a `text` / `review` / `feedback` header.</p>

        {loading ? <p className="muted-text">Processing batch...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {batchResult ? (
          <div className="batch-summary">
            <article className="metric-card">
              <span>Rows processed</span>
              <strong>{batchResult.processed}</strong>
            </article>
            <article className="metric-card">
              <span>Positive</span>
              <strong>{batchResult.summary?.totals?.positive || 0}</strong>
            </article>
            <article className="metric-card">
              <span>Negative</span>
              <strong>{batchResult.summary?.totals?.negative || 0}</strong>
            </article>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FileUploadPage;
