/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        offwhite: '#FAF8F5',
        'midnight-navy': '#07111F',
        'deep-navy': '#0D1B2E',
        ivory: '#F8F4EC',
        'warm-cream': '#F2E8DA',
        champagne: '#D6B77C',
        'soft-gold': '#C9A96E',
        'rose-champagne': '#D8B09A',
        'warm-beige': '#E4D5C3',
        cocoa: '#3A2C25',
        espresso: '#2A211D',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        serif2: ['"Cormorant Garamond"', 'serif'],
        script: ['"Cormorant"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 40px rgba(214, 183, 124, 0.35)',
        'gold-sm': '0 0 20px rgba(214, 183, 124, 0.25)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(10px,-24px) scale(1.15)', opacity: '0.85' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translate(-16px,-18px) scale(1.08)', opacity: '0.7' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(-12px,14px) rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float1: 'float1 7s ease-in-out infinite',
        float2: 'float2 9s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
