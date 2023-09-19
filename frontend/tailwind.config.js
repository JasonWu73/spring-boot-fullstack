/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "nord": {
          "200": "#ECEFF4",
          "300": "#E5E9F0",
          "400": "#D8DEE9",
          "500": "#2E3440",
          "600": "#3B4252",
          "700": "#434C5E",
          "800": "#4C566A"
        }
      }
    }
  },
  plugins: []
};

