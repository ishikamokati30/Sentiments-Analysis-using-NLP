import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { batchAnalyzeCsv, fetchAnalytics } from "../api/sentimentApi";
import Spinner from "../components/Spinner";

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
      onBatchAppend((current) =>
        [...response.results, ...current].slice(0, 100),
      );
      onAnalyticsRefresh(await fetchAnalytics());
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.message ||
          "Batch upload failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <motion.div
        whileHover={{ y: -3 }}
        className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
          Batch Processing
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
          Upload a CSV for bulk sentiment analytics
        </h2>
        <p className="mt-3 max-w-3xl text-slate-500 dark:text-slate-400">
          Drop a dataset of reviews or feedback rows and the platform will
          enrich each record with sentiment, emotions, aspects, sarcasm, and
          spam risk.
        </p>

        <label className="mt-6 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/25 bg-white/55 px-6 py-10 text-center dark:border-white/10 dark:bg-white/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
            {fileName || "Choose or drop a CSV file"}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Expected first column or a `text` / `review` / `feedback` header.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {loading ? (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Spinner className="h-4 w-4 border-slate-400/30 border-t-slate-700 dark:border-white/30 dark:border-t-white" />{" "}
            Processing batch...
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-300/40 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </p>
        ) : null}
      </motion.div>

      {batchResult ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/20 bg-white/55 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rows processed
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
              {batchResult.processed}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/20 bg-white/55 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Positive
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
              {batchResult.summary?.totals?.positive || 0}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/20 bg-white/55 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Negative
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
              {batchResult.summary?.totals?.negative || 0}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default FileUploadPage;
