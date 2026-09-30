/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mt Kenya forest green (primary). Same token names so admin pages retheme automatically.
        brand: {
          50: "#f1f7f2",
          100: "#dcebdf",
          200: "#b9d7c0",
          300: "#8fbc9b",
          400: "#5e9b70",
          500: "#3a7d51",
          600: "#1f6a3d",
          700: "#14532d",
          800: "#0f4023",
          900: "#0a2c18",
        },
        // Embu red-soil terracotta (secondary)
        accent: {
          50: "#fdf3ee",
          100: "#fae2d5",
          200: "#f4c2a8",
          300: "#ec9c74",
          400: "#e07649",
          500: "#c8532a",
          600: "#b04321",
          700: "#8f3519",
          800: "#6f2913",
          900: "#4d1c0d",
        },
        sun: { 300: "#fbd66a", 400: "#f7c33b", 500: "#efab0f", 600: "#c98a06" },
        ink: "#1b1512",
        paper: "#fbf5e9",
        clay: "#f1e6d0",
        mpesa: "#43b02a",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Figtree"', "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ['"Caveat"', "cursive"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #14532d 0%, #1f6a3d 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #fbf5e9 0%, #f1e6d0 100%)",
        "brand-radial": "radial-gradient(circle at top right, rgba(239,171,15,0.18), transparent 60%)",
      },
      boxShadow: {
        // Hard "printed poster" shadows instead of soft glows
        glow: "3px 3px 0 0 #1b1512",
        "glow-lg": "5px 5px 0 0 #1b1512",
        pop: "4px 4px 0 0 #1b1512",
        "pop-sm": "2px 2px 0 0 #1b1512",
        "pop-red": "4px 4px 0 0 #b04321",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
