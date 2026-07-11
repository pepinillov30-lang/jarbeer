/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand orange
        orange: {
          DEFAULT: '#FAA00',
          50: '#fff4eb',
          100: '#ffe4c7',
          200: '#ffc68f',
          300: '#ffa557',
          400: '#fb831f',
          500: '#FA6A00',
          600: '#d95a00',
          700: '#b34900',
          800: '#8c3900',
          900: '#662900',
        },
        // Electric blue
        electric: {
          50: '#e6f3ff',
          100: '#cce7ff',
          200: '#99cfff',
          300: '#66b7ff',
          400: '#339fff',
          500: '#0087ff',
          600: '#006fd4',
          700: '#0057a8',
          800: '#003f7c',
          900: '#002750',
          950: '#001830',
        },
        // Cyan
        cyan: {
          50: '#e6fcff',
          100: '#ccf9ff',
          200: '#99f3ff',
          300: '#66edff',
          400: '#33e7ff',
          500: '#00e1ff',
          600: '#00b4cc',
          700: '#008799',
          800: '#005a66',
          900: '#002d33',
          950: '#001619',
        },
        // Graphite / neutral
        ink: {
          50: '#f4f5f7',
          100: '#e8eaee',
          200: '#d0d4dc',
          300: '#adb3bf',
          400: '#7f8899',
          500: '#5e6673',
          600: '#434952',
          700: '#2d3038',
          800: '#1e2027',
          900: '#13151a',
          950: '#090a0d',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-slow-r': 'spin-r 18s linear infinite',
        'spin-med': 'spin 7s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'orbit': 'orbit 8s linear infinite',
        'scan-y': 'scan-y 5s ease-in-out infinite',
        'flicker': 'flicker 0.15s ease-in-out infinite',
        'glow-in': 'glow-in 0.6s ease-out forwards',
      },
      keyframes: {
        'spin-r': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.9' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(70px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(70px) rotate(-360deg)' },
        },
        'scan-y': {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(200%)', opacity: '0' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'glow-in': {
          '0%': { opacity: '0', filter: 'blur(12px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'grid-fine': "linear-gradient(rgba(0,225,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,225,255,0.03) 1px, transparent 1px)",
        'grid-coarse': "linear-gradient(rgba(0,135,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,135,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-20': '20px 20px',
        'grid-80': '80px 80px',
      },
      boxShadow: {
        'holo-cyan': '0 0 30px rgba(0,225,255,0.35), 0 0 60px rgba(0,225,255,0.15), inset 0 0 20px rgba(0,225,255,0.05)',
        'holo-electric': '0 0 30px rgba(0,135,255,0.35), 0 0 60px rgba(0,135,255,0.15), inset 0 0 20px rgba(0,135,255,0.05)',
        'holo-orange': '0 0 25px rgba(250,106,0,0.5), 0 0 50px rgba(250,106,0,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
        'panel': '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
