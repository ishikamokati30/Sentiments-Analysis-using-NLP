import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import AnimatedBackground from "../components/AnimatedBackground";
import SidebarNav from "../components/SidebarNav";
import TopNavbar from "../components/TopNavbar";

function MainLayout({ children, onLogout, theme, onToggleTheme, user }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100">
      <AnimatedBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <SidebarNav onLogout={onLogout} />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <TopNavbar user={user} theme={theme} onToggleTheme={onToggleTheme} />
          <div className="flex flex-wrap gap-3 lg:hidden">
            {[
              ["/", "Analyzer"],
              ["/dashboard", "Dashboard"],
              ["/upload", "Batch Upload"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to}>
                {({ isActive }) => (
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-white/55 text-slate-600 dark:bg-white/5 dark:text-slate-300"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Log out
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-w-0"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
