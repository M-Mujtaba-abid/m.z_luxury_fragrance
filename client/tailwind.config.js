/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "luxury-ink": "#0a0a0a",
        "luxury-gold": "#c9a24b",
        "luxury-cream": "#f5f0e6",
      },
    },
  },
  plugins: [],
}

