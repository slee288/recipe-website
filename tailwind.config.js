/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      height: {
        "112": "28rem",
        "120": "30rem",
        "128": "32rem"
      }
    },
  },
  plugins: [],
}

