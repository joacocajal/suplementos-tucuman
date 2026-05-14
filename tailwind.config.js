import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#161616",
        border: "#262626",
        foreground: "#FAFAFA",
        muted: "#A1A1AA",
        accent: {
          DEFAULT: "#FF6B1A",
          hover: "#FF8540",
        },
        success: "#22C55E",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["Anton", "Bebas Neue", ...fontFamily.sans],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [animate],
};
