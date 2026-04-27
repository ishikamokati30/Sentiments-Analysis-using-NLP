import { BarChart3, FileUp, LogOut, ScanText } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Analyzer", icon: ScanText },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/upload", label: "Batch Upload", icon: FileUp },
];

function SidebarNav({ onLogout }) {
  return (
    <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-white/20 bg-white/55 p-5 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/50 lg:flex lg:flex-col">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
          SentimentOS
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          AI signal command center
        </h1>
      </div>

      <nav className="space-y-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950"
                    : "bg-white/40 text-slate-600 hover:bg-white/70 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white dark:text-slate-950"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}

export default SidebarNav;
