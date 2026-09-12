import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apple: {
          black: "#000000",
          card: "#0d0d12",
          cardSubtle: "#14141c",
          cardHover: "#1c1c28",
          white: "#F5F5F7",
          silver: "#A1A1A6",
          gray: "#6E6E73",
          darkGray: "#3A3A3C",
          blue: "#2997FF",
          cyan: "#00E5FF",
          orange: "#FF9F0A",
          coral: "#EA580C",
          green: "#30D158",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "SF Mono",
          "JetBrains Mono",
          "ui-monospace",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "28px",
        "4xl": "36px",
      },
      backgroundImage: {
        "apple-radial": "radial-gradient(circle at 50% 30%, rgba(41, 151, 255, 0.08), transparent 70%)",
        "apple-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))",
      },
      boxShadow: {
        "apple-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "apple-card": "0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "apple-glow": "0 0 50px -10px rgba(41, 151, 255, 0.3)",
        "apple-orange": "0 0 40px -8px rgba(255, 159, 10, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
