import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        satz: {
          bg: "#1F2937",
          text: "#F9FAFB",
          muted: "#9CA3AF",
          border: "#334155",
          blue: "#2563EB",
          green: "#059669",
          red: "#B91C1C",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
