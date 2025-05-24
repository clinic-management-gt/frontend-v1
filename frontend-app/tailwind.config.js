/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "primary-color-variation-1": "var(--primary-color-variation-1)",
        "primary-color-variation-2": "var(--primary-color-variation-2)",
        "patient-page-color": "var(--patient-page-color)",
      }
    },
  },
  plugins: [],
}

