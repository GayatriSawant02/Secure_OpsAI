import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      colors: {
        // Dark background system
        "ops-bg": "#080c14",
        "ops-surface": "#0d1321",
        "ops-card": "#111827",
        "ops-border": "#1e2d40",
        "ops-border-light": "#253347",

        // Cyan accent system
        "ops-cyan": "#00d4ff",
        "ops-cyan-dim": "#0099bb",
        "ops-cyan-glow": "rgba(0, 212, 255, 0.15)",

        // Green accent
        "ops-green": "#00ff88",
        "ops-green-dim": "#00cc6a",

        // Severity colors
        "sev-high": "#ef4444",
        "sev-high-bg": "rgba(239, 68, 68, 0.1)",
        "sev-high-border": "rgba(239, 68, 68, 0.3)",
        "sev-medium": "#f97316",
        "sev-medium-bg": "rgba(249, 115, 22, 0.1)",
        "sev-medium-border": "rgba(249, 115, 22, 0.3)",
        "sev-low": "#eab308",
        "sev-low-bg": "rgba(234, 179, 8, 0.1)",
        "sev-low-border": "rgba(234, 179, 8, 0.3)",
        "sev-info": "#3b82f6",
        "sev-info-bg": "rgba(59, 130, 246, 0.1)",

        // Text hierarchy
        "ops-text": "#e2e8f0",
        "ops-text-dim": "#94a3b8",
        "ops-text-muted": "#475569",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        "cyber-gradient":
          "linear-gradient(135deg, #080c14 0%, #0d1321 50%, #080c14 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(0,0,0,0) 100%)",
        "threat-gradient":
          "linear-gradient(90deg, rgba(239,68,68,0.1) 0%, transparent 100%)",
      },
      backgroundSize: {
        "grid-lg": "40px 40px",
      },
      boxShadow: {
        "cyber-glow": "0 0 20px rgba(0,212,255,0.15), 0 0 40px rgba(0,212,255,0.05)",
        "threat-glow": "0 0 15px rgba(239,68,68,0.2)",
        "card-shadow": "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "blink": "blink 1s step-end infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
