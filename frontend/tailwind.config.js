/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.image-render-pixelated': {
          'image-rendering': 'pixelated'
        }
      });
    }
  ]
}
