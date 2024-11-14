/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#d1c0a6",
        "primary-medium": "#B8A78D",
        "primary-dark": "#534A42",
        'error': '#A24857',
        'error-light': '#DDA4AB'
      },
    },
  },
  plugins: [],
};
