/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#615dff',
        secondary: '#fe7a36',
        'primary-dark': '#0b1427',
        card: '#ffffff',
        muted: '#8a96a3',
      },
    },
  },
  plugins: [],
}
