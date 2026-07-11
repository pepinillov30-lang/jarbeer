/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#020408',
          900: '#060c14',
          800: '#0d1824',
          700: '#1a2a3a',
          600: '#2a3d52',
          500: '#4a6070',
          400: '#6a8090',
          300: '#90a8b8',
        },
        electric: {
          400: '#00e1ff',
          500: '#00b8d4',
          600: '#0087ff',
        },
        amber: {
          DEFAULT: '#FFAA00',
          dark: '#cc8800',
        },
        orange: {
          DEFAULT: '#FA6A00',
          dark: '#c55200',
        },
      },
      keyframes: {
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
