/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#40D7C3",
        "primary-color-variation-1": "#3bc0ae",
        "primary-color-variation-2": "#1edfc5",
        "patient-page-color": "#B300C7",
        "document-color": "#8440d7",
      },
    },
  },
  plugins: [],
};
