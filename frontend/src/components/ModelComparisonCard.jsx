import { motion } from "framer-motion";

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      <strong className="text-slate-900 dark:text-white">{value}</strong>
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
    <section className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyan-300">
        Model Comparison
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
        Benchmark snapshot
      </h2>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {rows.map(([label, metrics]) => (
          <motion.article
            key={label}
            whileHover={{ y: -4 }}
            className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {label}
            </h3>
            <div className="space-y-3">
              <MetricRow label="Accuracy" value={metrics?.accuracy ?? 0} />
              <MetricRow label="Precision" value={metrics?.precision ?? 0} />
              <MetricRow label="Recall" value={metrics?.recall ?? 0} />
              <MetricRow label="Samples" value={metrics?.sampleSize ?? 0} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ModelComparisonCard;
