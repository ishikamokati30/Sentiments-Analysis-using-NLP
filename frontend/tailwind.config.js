/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081124",
        mist: "#e7eef9",
        accent: "#6ee7f9",
        aurora: "#7c3aed",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(15, 23, 42, 0.22)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 12px 32px rgba(34,211,238,0.16)",
      },
      animation: {
        floaty: "floaty 9s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        pulsegrid: "pulsegrid 9s ease-in-out infinite",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(5deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(10px, -18px, 0) scale(1.06)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulsegrid: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(125, 211, 252, 0.35), transparent 28%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.2), transparent 22%), linear-gradient(140deg, #f8fafc 0%, #dbeafe 48%, #eef2ff 100%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(34, 211, 238, 0.16), transparent 26%), radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 20%), linear-gradient(145deg, #020617 0%, #0f172a 42%, #111827 100%)",
      },
    },
  },
  plugins: [],
};
