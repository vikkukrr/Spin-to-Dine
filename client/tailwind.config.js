/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f2',
          100: '#dceee2',
          200: '#baddc6',
          300: '#8fc3a1',
          400: '#5fa37a',
          500: '#4A7C59',
          600: '#3a6347',
          700: '#2f4f39',
          800: '#28402f',
          900: '#1E2A1E',
        },
        cream: {
          50: '#FDFCF9',
          100: '#F8F6F1',
          200: '#F0ECE3',
          300: '#E5DFD1',
        },
        gold: {
          400: '#D4A853',
          500: '#C9952E',
          600: '#B07D1A',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
