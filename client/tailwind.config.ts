import type { Config } from "tailwindcss";

const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: c("bg"),
        surface: c("surface"),
        "surface-2": c("surface-2"),
        line: c("line"),
        fg: c("fg"),
        muted: c("muted"),
        brand: { DEFAULT: c("brand"), soft: c("brand-soft") },
        income: c("income"),
        expense: c("expense"),
        warn: c("warn"),
      },
      fontFamily: { sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)",
        glow: "0 10px 30px -10px rgb(var(--brand) / 0.55)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { shimmer: "shimmer 1.4s infinite" },
    },
  },
  plugins: [],
};
export default config;
