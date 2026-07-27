/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "mts-black": "#0B0F14",
        "mts-navy": "#0F2747",
        "mts-blue": "#1E5AA8",
        "mts-steel": "#64748B",
        "mts-surface": "#F8FAFC",
        "mts-dark": "#080C12",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        accent: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "mts-gradient": "linear-gradient(135deg, #0B0F14, #0F2747)",
        "mts-gradient-cta": "linear-gradient(135deg, #0F2747, #1E5AA8)",
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(11, 15, 20, 0.25)",
        soft: "0 10px 30px -10px rgba(15, 39, 71, 0.15)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(12px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out both",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
