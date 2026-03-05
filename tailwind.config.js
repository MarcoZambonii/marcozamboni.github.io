/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "Arial", "sans-serif"],
      },
      colors: {
        // BlackswanQuants-like accent (approx.)
        accent: "hsl(265 60% 65%)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(160, 100, 255, 0.30)",
        glowStrong: "0 0 40px rgba(160, 100, 255, 0.45)",
      },
    },
  },
  plugins: [],
};
