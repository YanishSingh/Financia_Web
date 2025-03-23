/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: "#CC97FF",
          secondary: "#7F3DFF",
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
      },
    },
    plugins: [],
  };
  