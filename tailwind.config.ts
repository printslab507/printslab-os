import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EF",
        surface: "#FFFFFF",
        ink: "#16202B",
        "ink-muted": "#5B6672",
        line: "#DEDAD0",
        navy: {
          DEFAULT: "#0E3A53",
          light: "#175077",
        },
        clay: "#D9622B",
        ok: { DEFAULT: "#2F7A4F", bg: "#E7F3EA" },
        warn: { DEFAULT: "#B98418", bg: "#FBF1DD" },
        bad: { DEFAULT: "#B23A2E", bg: "#FBE9E6" },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
