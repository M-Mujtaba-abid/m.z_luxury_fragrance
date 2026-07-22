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
        "luxury-ink": "#0b101d",       // Base Dark Blue background
        "luxury-card": "#111827",      // Card Surface background
        "luxury-elevated": "#1a233a",  // Elevated elements / Hover states
        "luxury-gold": "#d4af37",      // Premium Warm Gold Accent
        "luxury-gold-bright": "#f3cb52", // Bright Gold Hover/Active
        "luxury-cream": "#f8f5ee",     // Off-white / Cream Text
      },
    },
  },
  plugins: [],
}