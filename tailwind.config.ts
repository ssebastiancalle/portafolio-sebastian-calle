import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-space-mono)", "var(--font-ibm-plex-mono)", "monospace"],
        ibm: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        "gray-dim": "#555555",
        "gray-mid": "#888888",
        "gray-soft": "#aaaaaa",
      },
      letterSpacing: {
        widest: "0.25em",
        ultrawide: "0.4em",
      },
    },
  },
  plugins: [],
};

export default config;
