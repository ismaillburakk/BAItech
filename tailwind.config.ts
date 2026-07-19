import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        paper: "var(--paper)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          2: "var(--rule-2)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          ink: "var(--amber-ink)",
        },
        green: {
          DEFAULT: "var(--green)",
          ink: "var(--green-ink)",
        },
      },
      fontFamily: {
        // next/font aileleri hash'li adlarla kaydeder; onlara yalnızca bu
        // değişkenler üzerinden erişilebilir (düz ad kullanmak fallback'e düşürür).
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        pill: "999px",
      },
      maxWidth: {
        wrap: "1360px",
      },
      letterSpacing: {
        mono: "0.08em",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out",
        "spin-slow": "spin 40s linear infinite",
        "spin-reverse": "spin 28s linear infinite reverse",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
