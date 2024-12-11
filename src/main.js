import './assets/main.css'  // Tailwind CSS import

import { createApp } from "vue";  // Import Vue 3
import { createPinia } from "pinia";  // Import Pinia for state management
import router from "./router";  // Import Vue Router
import App from "./App.vue";  // Import root component (App.vue)

const app = createApp(App);  // Create Vue app instance

app.use(createPinia());  // Set up Pinia store
app.use(router);  // Set up router

app.mount("#app");  // Mount app to DOM
