/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        riza: {
          pastel: {
            50: '#F5F9FC',
            100: '#EBF3FA',
            200: '#D4E4F7',
            300: '#B8D4F0',
            400: '#94BEFA',
            500: '#6FA3EA',
          },
          powder: '#C5DDF5',
          cream: {
            50: '#FFFDF9',
            100: '#FAF7F2',
            200: '#F4EFE6',
            300: '#EBE3D5',
            400: '#DED3C1',
          },
          ivory: '#FFFDF9',
          beige: '#F2ECE4',
          slate: {
            100: '#E2E8F0',
            300: '#94A3B8',
            500: '#64748B',
            600: '#5C728A',
            700: '#4A607A',
            800: '#2C3E50',
            900: '#1E293B',
          },
          gold: {
            100: '#FDF8E7',
            300: '#F5E6B3',
            500: '#E5C158',
            600: '#D4AF37',
            700: '#B59122',
          }
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(92, 114, 138, 0.06)',
        'soft': '0 8px 30px -4px rgba(92, 114, 138, 0.08)',
        'soft-lg': '0 16px 40px -6px rgba(92, 114, 138, 0.12)',
        'glow': '0 0 25px -5px rgba(212, 175, 55, 0.15)',
      },
      letterSpacing: {
        'widest-xl': '0.25em',
        'super-wide': '0.35em',
      }
    },
  },
  plugins: [],
}
