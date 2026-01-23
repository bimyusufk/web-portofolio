import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "rgb(var(--rose-50) / <alpha-value>)",
          100: "rgb(var(--rose-100) / <alpha-value>)",
          300: "rgb(var(--rose-300) / <alpha-value>)",
          500: "rgb(var(--rose-500) / <alpha-value>)",
          700: "rgb(var(--rose-700) / <alpha-value>)",
        },
        amber: {
          100: "rgb(var(--amber-100) / <alpha-value>)",
          700: "rgb(var(--amber-700) / <alpha-value>)",
        },
        accent: "rgb(var(--accent) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(120deg, rgb(var(--rose-50)) 0%, rgba(189, 195, 199, 0.4) 100%)",
        noise:
          "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 160 160%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.03%22/%3E%3C/svg%3E')",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.1)",
        floating: "0 10px 35px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
