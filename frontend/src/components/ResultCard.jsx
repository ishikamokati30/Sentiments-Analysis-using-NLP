import { AlertTriangle, Languages, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import AspectBreakdown from "./AspectBreakdown";
import ConfidenceMeter from "./ConfidenceMeter";
import HighlightedText from "./HighlightedText";

const EMOTION_ICONS = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  neutral: "😐",
  fear: "😟",
  surprise: "😲",
};

function ResultCard({ result }) {
  if (!result) {
    return (
      <article className="rounded-[2rem] border border-dashed border-white/20 bg-white/35 p-8 text-sm text-slate-500 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-400">
        Results will appear here with animated reveal, aspect cards, keyword
        impact, and confidence signals.
      </article>
    );
  }

  const emotions = Object.entries(result.emotions?.distribution || {});

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
            Advanced Analysis
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Sentiment result
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white dark:bg-white dark:text-slate-950">
            {result.sentiment}
          </span>
          <span className="rounded-full bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
            {result.mood}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                <Sparkles className="h-3.5 w-3.5" /> Sentiment
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {result.sentiment}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                <Languages className="h-3.5 w-3.5" /> Language
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {result.language}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                <AlertTriangle className="h-3.5 w-3.5" /> Sarcasm
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {result.sarcasm?.level || "Low"}
              </p>
            </div>
          </div>

          <ConfidenceMeter score={result.sentimentScore} />

          <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Explainable keywords
            </h3>
            <HighlightedText items={result.explainability?.influentialWords} />
          </div>

          <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Aspect breakdown
            </h3>
            <AspectBreakdown aspects={result.aspects} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Emotion badges
            </h3>
            <div className="flex flex-wrap gap-3">
              {emotions.map(([emotion, value]) => (
                <div
                  key={emotion}
                  className="rounded-full bg-slate-950/90 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950"
                >
                  {EMOTION_ICONS[emotion] || "•"} {emotion}:{" "}
                  {Number(value).toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Model outputs
            </h3>
            <div className="grid gap-3">
              {Object.entries(result.models || {}).map(([key, model]) => (
                <motion.article
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-[1.25rem] border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/40"
                >
                  <p className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {key}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Label: <strong>{model.label}</strong>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Score: {Number(model.score).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Confidence: {Number(model.confidence).toFixed(2)}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ResultCard;
