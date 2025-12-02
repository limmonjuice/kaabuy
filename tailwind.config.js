/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        flipToRegister: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        flipToLogin: {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        swapLeft: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateX(-100%) scale(0.8)', opacity: '0' },
          '51%': { transform: 'translateX(100%) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        swapRight: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateX(100%) scale(0.8)', opacity: '0' },
          '51%': { transform: 'translateX(-100%) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}