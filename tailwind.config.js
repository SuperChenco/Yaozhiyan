/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        yaozhiyan: {
          primary: "#1E3A5F",
          primaryLight: "#2D4F7C",
          primaryDark: "#152A45",
          secondary: "#4A90A4",
          secondaryLight: "#6BB3C9",
          accent: "#00D4AA",
          gray: {
            50: "#F8F9FA",
            100: "#E9ECEF",
            200: "#DEE2E6",
            300: "#CED4DA",
            400: "#ADB5BD",
            500: "#6C757D",
            600: "#495057",
            700: "#343A40",
            800: "#212529",
            900: "#16191D",
          },
          concrete: "#8B8B8B",
          concreteLight: "#B8B8B8",
          concreteDark: "#5A5A5A",
          metal: "#C0C0C0",
          metalLight: "#E8E8E8",
          success: "#28A745",
          warning: "#FFC107",
          danger: "#DC3545",
          info: "#17A2B8",
        },
      },
      fontFamily: {
        sans: [
          "HarmonyOS Sans",
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "highlight-pulse": "highlightPulse 1.2s ease-in-out 3",
        "slide-in": "slideIn 0.25s ease-out",
        "pop-in": "popIn 0.2s ease-out",
      },
      keyframes: {
        highlightPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(7,193,96,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(7,193,96,0.55)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
