/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F1E3',
          light: '#FBF8F0',
          dark: '#EBE2CD',
        },
        dark: {
          DEFAULT: '#111111',
          sidebar: '#202124',
          card: '#1A1B1E',
          surface: '#282A2E',
          border: '#33353A',
        },
        gold: {
          DEFAULT: '#C8A653',
          light: '#E8D49A',
          dark: '#A68434',
          subtle: '#FFF9ED',
          border: '#DFC27D',
        },
        cream: '#FFF9ED',
        rose: {
          DEFAULT: '#E99CB0',
          light: '#F6CDD7',
          dark: '#C87289',
        },
        spartan: {
          text: '#171717',
          muted: '#77716A',
          bg: '#F7F1E3',
          gold: '#C8A653',
        }
      },
      fontFamily: {
        heading: ['Oswald', 'Impact', 'sans-serif'],
        spartan: ['"Cinzel"', '"Oswald"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 8px -1px rgba(200, 166, 83, 0.25)',
        'gold-md': '0 4px 16px -2px rgba(200, 166, 83, 0.35)',
        'gold-lg': '0 10px 25px -5px rgba(200, 166, 83, 0.45)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
