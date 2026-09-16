/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          dark: '#050811',
          card: '#0a101f',
          border: '#1e293b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#a855f7'
        }
      }
    },
  },
  plugins: [],
}