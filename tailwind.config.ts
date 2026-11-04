import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sacred: {
          50: "#fdfbf7",
          100: "#fbf6ec",
          200: "#f5eacc",
          300: "#eddaa3",
          400: "#e0c26c",
          500: "#d4af37", // Gold / Ouro Sagrado
          600: "#b5902b",
          700: "#917024",
          800: "#755a23",
          900: "#624a21",
        },
        sanctuary: {
          950: "#080b10",
          900: "#0d1117",
          850: "#121720",
          800: "#161b22",
          700: "#21262d",
          600: "#30363d",
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        display: ["Cinzel", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "glow-lg": "0 0 45px -10px rgba(212, 175, 55, 0.35)",
      }
    },
  },
  plugins: [],
};
export default config;
