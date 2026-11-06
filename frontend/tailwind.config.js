/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFAF6',
          100: '#FAF6F0',
          200: '#F4ECE0',
          300: '#EDE0CE',
          400: '#E2CEB5',
          500: '#D4BA99',
        },
        champagne: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#EBDDCB',
          300: '#DFC7AC',
          400: '#CFAD89',
          500: '#BE956B',
        },
        gold: {
          50: '#FCFAF2',
          100: '#F7F2DE',
          200: '#EFE2B9',
          300: '#E3CE8F',
          400: '#D4B866',
          500: '#C29F41', // Signature Aurelle Gold
          600: '#A4802E',
          700: '#826122',
          800: '#64471B',
          900: '#463013',
        },
        noir: {
          950: '#0C0A09',
          900: '#171412', // Pure luxury deep charcoal
          800: '#26221F',
          700: '#3D3732',
          600: '#59514A',
          500: '#786E65',
          400: '#9A8F85',
          300: '#C0B7AD',
          200: '#DFD8D0',
          100: '#EFEBE6',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 20px 40px -15px rgba(23, 20, 18, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(23, 20, 18, 0.16)',
        gold: '0 8px 25px -5px rgba(194, 159, 65, 0.25)',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #F5EED9 0%, #D4B866 50%, #C29F41 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(23,20,18,0) 0%, rgba(23,20,18,0.85) 100%)',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
    },
  },
  plugins: [],
};

