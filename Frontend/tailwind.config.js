/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        allison: ["Allison", "cursive"],
        darker: ["Darker Grotesque", "sans-serif"],
        reem: ["Reem Kufi", "sans-serif"],
        bartle: ["BBH Bartle", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        sixcaps: ["Six Caps", "sans-serif"],
      },
    },
  },
  plugins: [],
};
