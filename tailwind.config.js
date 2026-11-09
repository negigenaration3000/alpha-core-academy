/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080F22',
          sidebar: '#0C1730',
          card: '#111F3B',
          elevated: '#17294A',
          blue: '#1677FF',
          'blue-light': '#38A5FF',
          orange: '#FF991F',
          border: '#263B5C',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
        navy: {
          950: '#050A18',
          900: '#080F22', // Primary background
          850: '#0C1730', // Sidebar background
          800: '#111F3B', // Card background
          750: '#17294A', // Elevated surface
          700: '#1E335C', // Hover state
          600: '#263B5C', // Borders
          500: '#334D77',
        },
        primary: {
          DEFAULT: '#1677FF', // Primary blue
          hover: '#0E62DD',
          light: '#38A5FF', // Secondary blue
          dark: '#0A4EB5',
          glow: 'rgba(22, 119, 255, 0.35)',
        },
        baba: {
          orange: '#FF991F',
          'orange-hover': '#E68512',
          'orange-light': '#FFB356',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#38A5FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
        'blue-glow': '0 0 25px -3px rgba(22, 119, 255, 0.35)',
        'orange-glow': '0 0 20px -3px rgba(255, 153, 31, 0.35)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
