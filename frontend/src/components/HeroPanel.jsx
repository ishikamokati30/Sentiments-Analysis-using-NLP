import { BrainCircuit, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import AiOrbCanvas from "../3d/AiOrbCanvas";
import { fadeUp, staggerContainer } from "../animations/variants";

const statCards = [
  { key: "total", label: "Total analyses", icon: BrainCircuit },
  { key: "positives", label: "Positive signals", icon: Sparkles },
  { key: "risky", label: "Flagged risk", icon: ShieldAlert },
];

function HeroPanel({ stats }) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
    >
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/55 p-7 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">AI Sentiment Analytics</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-5xl">
          Premium sentiment intelligence with animated insight surfaces.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Analyze reviews across sentiment, emotions, sarcasm, spam, and aspect-level breakdowns in a modern SaaS
          workspace designed for research and operations teams.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {statCards.map(({ key, label, icon: Icon }) => (
            <motion.article
              key={key}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[1.5rem] border border-white/20 bg-white/60 p-5 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{stats[key]}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/40 p-3 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/35"
      >
        <AiOrbCanvas />
      </motion.div>
    </motion.section>
  );
}

export default HeroPanel;
