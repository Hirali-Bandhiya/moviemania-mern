export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e60a15",
        "background-dark": "#0f0f0f",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};