/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b3ccff",
          300: "#80a9ff",
          400: "#4d7fff",
          500: "#265cf0",
          600: "#1a45c7",
          700: "#16389d",
          800: "#152f7a",
          900: "#152a63",
        },
      },
    },
  },
  plugins: [],
};
