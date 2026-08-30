import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // System font stack — no external font fetch, keeps builds
        // reliable in network-restricted deploy environments (e.g. cPanel).
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        clay: {
          bg: "#E9DAC3",
          surface: "#F5EBDC",
          surface2: "#EEE0CB",
          ink: "#4A3F35",
          ink2: "#8A7A67",
          terracotta: { DEFAULT: "#C1544A", dark: "#8F3B33", light: "#E2A39C" },
          mustard: { DEFAULT: "#D9A24B", dark: "#A6772F", light: "#EFCE94" },
          olive: { DEFAULT: "#8C7A4A", dark: "#5F5230", light: "#C4B385" },
          sage: { DEFAULT: "#7FA07E", dark: "#567159", light: "#B7CDAF" },
          steel: { DEFAULT: "#5B6B85", dark: "#3D4A5E", light: "#A6B2C4" },
          periwinkle: { DEFAULT: "#7E86BC", dark: "#565C8C", light: "#C0C4E4" },
        },
      },
      boxShadow: {
        clay: "9px 9px 18px rgba(120,94,68,0.22), -7px -7px 15px rgba(255,255,255,0.75)",
        "clay-sm": "5px 5px 11px rgba(120,94,68,0.2), -4px -4px 9px rgba(255,255,255,0.7)",
        "clay-inset": "inset 3px 3px 6px rgba(120,94,68,0.28), inset -3px -3px 6px rgba(255,255,255,0.55)",
        "clay-pressed": "inset 4px 4px 9px rgba(90,70,50,0.35), inset -3px -3px 7px rgba(255,255,255,0.45)",
      },
      borderRadius: {
        clay: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
