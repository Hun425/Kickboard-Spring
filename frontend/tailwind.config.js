/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        KoPubLight: ['KoPubDotumLight', 'sans-serif'],
        KoPubMedium: ['KoPubDotumMedium', 'sans-serif'],
        KoPubBold: ['KoPubDotumBold', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
