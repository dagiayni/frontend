/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#800020',
          dark:    '#1A0008',
          light:   '#F5E6E8',
          white:   '#FFFFFF',
          hover:   '#5C0016',
        },
        success: '#10694F',
        warning: '#B45309',
        danger:  '#DC2626',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        amharic: ['Noto Sans Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
