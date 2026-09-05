import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Skala mengikuti Google Material / Cloud Console:
 * radius kecil (4px aksi, 8px kartu), bayangan abu berlapis,
 * dan satu warna aksi. Tidak ada gradien dekoratif.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
    "./src/sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          subtle: "rgb(var(--surface-subtle) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
          inverse: "rgb(var(--surface-inverse) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
          inverse: "rgb(var(--text-inverse) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          hover: "rgb(var(--brand-hover) / <alpha-value>)",
          active: "rgb(var(--brand-active) / <alpha-value>)",
          tint: "rgb(var(--brand-tint) / <alpha-value>)",
          "tint-strong": "rgb(var(--brand-tint-strong) / <alpha-value>)",
          on: "rgb(var(--brand-on-tint) / <alpha-value>)",
        },
        status: {
          red: "rgb(var(--status-red) / <alpha-value>)",
          yellow: "rgb(var(--status-yellow) / <alpha-value>)",
          green: "rgb(var(--status-green) / <alpha-value>)",
          blue: "rgb(var(--status-blue) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "Roboto Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Skala tipografi Cloud: judul besar berbobot ringan, teks UI 14px.
        display: ["3.5rem", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-sm": ["2.75rem", { lineHeight: "1.16", letterSpacing: "-0.018em", fontWeight: "400" }],
        headline: ["2rem", { lineHeight: "1.25", letterSpacing: "-0.014em", fontWeight: "400" }],
        title: ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em", fontWeight: "400" }],
        subtitle: ["1.125rem", { lineHeight: "1.44", letterSpacing: "0", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6" }],
        ui: ["0.875rem", { lineHeight: "1.43" }],
        caption: ["0.75rem", { lineHeight: "1.33", letterSpacing: "0.008em" }],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-3": "var(--elevation-3)",
        none: "none",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "100ms",
        DEFAULT: "150ms",
        slow: "250ms",
      },
      maxWidth: {
        prose: "68ch",
        site: "1280px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 250ms cubic-bezier(0, 0, 0.2, 1) both",
      },
      typography: () => ({
        gcp: {
          css: {
            "--tw-prose-body": "rgb(var(--text-secondary))",
            "--tw-prose-headings": "rgb(var(--text-primary))",
            "--tw-prose-lead": "rgb(var(--text-secondary))",
            "--tw-prose-links": "rgb(var(--brand))",
            "--tw-prose-bold": "rgb(var(--text-primary))",
            "--tw-prose-counters": "rgb(var(--text-tertiary))",
            "--tw-prose-bullets": "rgb(var(--border-strong))",
            "--tw-prose-hr": "rgb(var(--border-subtle))",
            "--tw-prose-quotes": "rgb(var(--text-primary))",
            "--tw-prose-quote-borders": "rgb(var(--brand))",
            "--tw-prose-captions": "rgb(var(--text-tertiary))",
            "--tw-prose-code": "rgb(var(--text-primary))",
            "--tw-prose-pre-code": "rgb(var(--text-primary))",
            "--tw-prose-pre-bg": "rgb(var(--surface-subtle))",
            "--tw-prose-th-borders": "rgb(var(--border))",
            "--tw-prose-td-borders": "rgb(var(--border-subtle))",
            maxWidth: "68ch",
            fontSize: "1rem",
            lineHeight: "1.75",
            h2: { fontWeight: "400", letterSpacing: "-0.014em" },
            h3: { fontWeight: "500", letterSpacing: "-0.01em" },
            a: { fontWeight: "400", textUnderlineOffset: "3px" },
            code: {
              fontWeight: "400",
              backgroundColor: "rgb(var(--surface-sunken))",
              padding: "0.15em 0.35em",
              borderRadius: "4px",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
