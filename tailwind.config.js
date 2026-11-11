/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C59B4A',
          light: '#DCC082',
          dark: '#A37A2F',
        },
        botanical: {
          DEFAULT: '#087A4B',
          light: '#0AA565',
          dark: '#055433',
        },
        nile: {
          DEFAULT: '#075DA8',
          light: '#0A82EA',
          dark: '#043E72',
        },
        offwhite: '#F8F6F0',
        darkgreen: '#073B2A',
        charcoal: '#18201D',
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'Tajawal', 'sans-serif'],
        english: ['var(--font-english)', 'Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
