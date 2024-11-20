/** @type {import('tailwindcss').Config} */

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}

const app = createApp(App);
app.use(createPinia());
app.mount('#app');


