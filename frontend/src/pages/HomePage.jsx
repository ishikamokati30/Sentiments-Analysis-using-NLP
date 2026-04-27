import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { analyzeTextAdvanced, fetchAnalytics } from "../api/sentimentApi";
import HeroPanel from "../components/HeroPanel";
import HistoryList from "../components/HistoryList";
import ResultCard from "../components/ResultCard";
import Spinner from "../components/Spinner";

function HomePage({ history, onAnalyze, onAnalyticsRefresh }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const positives = history.filter(
      (item) => item.sentiment === "positive",
    ).length;
    const risky = history.filter(
      (item) => item.spam?.isSpam || item.sarcasm?.isSarcastic,
    ).length;

    return {
      total: history.length,
      positives,
      risky,
    };
  }, [history]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Enter some text before running the analysis.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await analyzeTextAdvanced(text);
      setResult(payload);
      onAnalyze(payload);
      onAnalyticsRefresh(await fetchAnalytics());
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.message ||
          "Request failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <HeroPanel stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[2rem] border border-white/20 bg-white/55 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
                Analyzer
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                Run advanced multilingual sentiment analytics
              </h2>
            </div>
            <div className="hidden rounded-full bg-cyan-400/15 p-3 text-cyan-700 dark:block dark:text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/20 bg-white/45 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <TypeAnimation
              sequence={[
                "Try: Wow, just what I needed... a slower app.",
                1400,
                "Try: Camera is stunning but battery life is disappointing.",
                1400,
                "Try: Support team was helpful and the app feels much faster now.",
                1400,
              ]}
              speed={58}
              repeat={Infinity}
            />
          </div>

          <textarea
            className="mt-5 min-h-[220px] w-full rounded-[1.6rem] border border-white/20 bg-white/65 px-5 py-4 text-sm text-slate-700 outline-none backdrop-blur-xl transition focus:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:border-cyan-500"
            rows="8"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste English, Hindi, or Hinglish reviews, support logs, or campaign feedback here..."
          />

          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <motion.button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-glow dark:bg-white dark:text-slate-950"
            >
              {loading ? <Spinner /> : null}
              {loading ? "Analyzing..." : "Analyze Advanced Sentiment"}
            </motion.button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Includes score, emotions, aspects, sarcasm, spam, and
              explainability.
            </span>
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-rose-300/40 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}
        </motion.div>

        <ResultCard result={result} />
      </div>

      <HistoryList history={history.slice(0, 12)} compact />
    </section>
  );
}

export default HomePage;
