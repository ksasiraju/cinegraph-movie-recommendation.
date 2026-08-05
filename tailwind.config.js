/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graph: {
          dark: '#0b0f19',
          card: '#131b2e',
          accent: '#6366f1',
          user: '#f59e0b',
          movie: '#06b6d4',
          actor: '#a855f7',
          director: '#10b981',
          genre: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
