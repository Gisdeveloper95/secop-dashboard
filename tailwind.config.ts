import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c1118",
        surface: "#131a23",
        elev: "#1a2230",
        fg: "#f5f1e8",
        "fg-muted": "#b8af9e",
        "fg-subtle": "#786d5b",
        border: "#1f2935",
        "border-strong": "#2d3849",
        accent: "#d97757",
        "accent-fg": "#0c1118",
        "risk-low": "#5fb87a",
        "risk-med": "#b8954a",
        "risk-high": "#d97757",
        "risk-critical": "#c54a3b",
      },
      fontFamily: {
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
