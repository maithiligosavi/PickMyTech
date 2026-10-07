/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#090d16',
          800: '#0b1120',
          700: '#0f1626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(34,211,238,0.35)',
      },
    },
  },
  plugins: [],
};
