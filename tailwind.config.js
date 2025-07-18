/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-shake': 'fadeShake 0.8s both',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeShake: {
          '0%': { opacity: '0', transform: 'translateY(20px) rotate(-5deg)' },
          '40%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
          '60%': { transform: 'translateX(-5px) rotate(-2deg)' },
          '80%': { transform: 'translateX(5px) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'translateX(0) rotate(-8deg)' },
        },
      }
    },
  },
  plugins: [],
} 