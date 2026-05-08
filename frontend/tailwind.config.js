/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf3",
          100: "#d8f5e4",
          200: "#b5ebca",
          300: "#83dba4",
          400: "#4fc476",
          500: "#2ca456",
          600: "#1f8343",
          700: "#1d6738",
          800: "#1c522f",
          900: "#184328"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};