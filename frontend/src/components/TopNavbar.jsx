import { Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import ThemeToggle from "./ThemeToggle";

function TopNavbar({ user, theme, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-white/20 bg-white/50 px-5 py-4 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 lg:hidden">
          <Menu className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
            Realtime Insights
          </p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Premium sentiment workspace
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="hidden items-center gap-3 rounded-full border border-white/20 bg-white/60 px-4 py-2 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name || "Analyst"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email || "workspace@local"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TopNavbar;
