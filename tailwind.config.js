/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        trail: {
          bg: "#F4E3B2",
          sand: "#947268",
          surface: "#fff8dd",
          ink: "#310E10",
          muted: "#45462A",
          line: "rgba(49, 14, 16, 0.16)",
          accent: "#74070E",
          deep: "#310E10",
          soft: "#F4E3B2",
          warm: "#947268",
          warmSoft: "#ead0a7"
        }
      },
      boxShadow: {
        trail: "0 24px 60px rgba(49, 14, 16, 0.16)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      }
    }
  },
  plugins: []
};
