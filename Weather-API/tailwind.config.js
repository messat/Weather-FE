/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        times: ['Times New Roman', 'Times', 'serif'],
      },
    },
  },
  variants: {
    extend: {
      fontFamily: ["hover"]
    }
  },
  plugins: [],
}

