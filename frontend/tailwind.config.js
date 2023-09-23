/** @type {import("tailwindcss").Config} */
import tailwindcss from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        "night": {
          "1": "#2E3440",
          "2": "#3B4252",
          "3": "434C5E",
          "4": "4C566A"
        },
        "snow": {
          "1": "#ECEFF4",
          "2": "#E5E9F0",
          "3": "#ECEFF4"
        },
        "frost": {
          "1": "#8FBCBB",
          "2": "#88C0D0",
          "3": "#81A1C1",
          "4": "#5E81AC"
        },
        "aurora": {
          "1": "#BF616A",
          "2": "#D08770",
          "3": "#EBCB8B",
          "4": "#A3BE8C",
          "5": "#B48EAD"
        }
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [tailwindcss]
};