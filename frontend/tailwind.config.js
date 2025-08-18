/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
      },
    }
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
