import type { Config } from "tailwindcss";

// Simple, college-friendly colour palette (kept intentionally minimal).
// primary = academic blue, accent = warm amber used sparingly for alerts.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b3ccff",
          300: "#80abff",
          400: "#4d82ff",
          500: "#2563eb", // main brand blue
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
        },
        accent: {
          500: "#d97706", // amber, used only for warnings / pending badges
        },
        surface: "#f8fafc",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
