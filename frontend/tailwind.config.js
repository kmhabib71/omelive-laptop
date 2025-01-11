/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-dark": "#520073",
        "purple-light": "#7e0b7e",
      },
      backgroundImage: (theme) => ({
        "purple-gradient": "linear-gradient(135deg, #2c003e 0%, #800080 100%)",
        "gift-pattern": "url('/gift-background.svg')",
      }),
    },
  },
  plugins: [],
};
