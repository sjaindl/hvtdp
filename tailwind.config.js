/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      // Design system (design/hvtdp-current.pen): pink, white, black and neutral grays only.
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '80rem',
        prose: '45rem',
      },
    },
  },
  plugins: [],
};
