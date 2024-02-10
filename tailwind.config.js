/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        mainBackgroundColour: '#0D1117',
        columnBackgroundCOlour: '#161C22'
      }
    },
  },
  plugins: [],
}

