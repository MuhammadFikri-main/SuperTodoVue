/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui' // Import daisyui directly

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // Use the imported daisyui
}
