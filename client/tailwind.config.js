/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NB Classic Scents palette
        background: '#FAF8F5',
        beige: '#E8DCCB',
        taupe: '#B09878',
        'warm-brown': '#6B5543',
        gold: '#B89A6A',
        'dark-brown': '#3F332A',
        white: '#F8F5EF',

        // Legacy aliases kept so existing utility classes (bg-cocoa,
        // text-champagne, etc.) keep working — remapped onto the palette
        // above rather than their old hex values.
        offwhite: '#FAF8F5',
        'midnight-navy': '#3F332A',
        'deep-navy': '#6B5543',
        ivory: '#F8F5EF',
        'warm-cream': '#E8DCCB',
        champagne: '#B89A6A',
        'soft-gold': '#B09878',
        // kept distinct from the rest of the palette so error/destructive
        // states (form validation, remove, sold out) still read as alerts
        'rose-champagne': '#A8603E',
        'warm-beige': '#E8DCCB',
        cocoa: '#3F332A',
        espresso: '#3F332A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        serif2: ['"Cormorant Garamond"', 'serif'],
        script: ['"Cormorant"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 40px rgba(184, 154, 106, 0.35)',
        'gold-sm': '0 0 20px rgba(184, 154, 106, 0.25)',
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
