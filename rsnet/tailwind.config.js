/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0a0a0b",
          900: "#121214",
          800: "#1a1a1d",
          700: "#242428",
          600: "#333338",
          300: "#a8a8b0",
          200: "#c9c9d1",
          100: "#e5e5ea",
        },
        gold: {
          400: "#e8c37a",
          500: "#d4a94f",
          600: "#b8903f",
        },
        electric: {
          400: "#4f9dff",
          500: "#2563eb",
        },
      },
      fontFamily: {
        display: ["Syne", "Inter", "sans-serif"],
        body: ["DM Sans", "Roboto", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(212, 169, 79, 0.15), 0 8px 30px rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "fade-slide-up": "fadeSlideUp 0.45s ease-out both",
        "scale-in": "scaleIn 0.18s ease-out both",
      },
    },
  },
  plugins: [],
};
