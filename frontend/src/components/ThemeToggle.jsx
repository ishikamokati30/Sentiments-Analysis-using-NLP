import { MoonStar, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-glass backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </motion.button>
  );
}

export default ThemeToggle;
