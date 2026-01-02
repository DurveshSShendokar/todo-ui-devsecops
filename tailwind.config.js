/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          500: "#6b7280",
          100: "#f5f5f5",
        },
        red: {
          800: "#8b0000",
          400: "#ff6347",
        },
        blue: {
          500: "#007bff",
          300: "#5bc0de",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
