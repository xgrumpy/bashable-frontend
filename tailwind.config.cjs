/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3442F4",
        secondary: "#FF00CC",
        body: "#BDBFD4",
        bodylight: "#454545",
        dark: "#11121C",
        light: "#171825",
        grey: "#f1f5f1",
        border: "#2E2F45",
        borderlight: "#c2c4ce",
      },
      fontFamily: {
        sans: ["'Exo 2'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
