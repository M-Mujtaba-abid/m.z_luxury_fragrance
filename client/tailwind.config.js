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
        "luxury-ink": "#14141a",
        "luxury-card": "#1c1c24",
        "luxury-elevated": "#242430",
        "luxury-gold": "#c9a24b",
        "luxury-gold-bright": "#e0ba6a",
        "luxury-cream": "#f5f0e6",
      },
    },
  },
  plugins: [],
}

