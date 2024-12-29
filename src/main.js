import './assets/main.css'  // Tailwind CSS import

import { createApp } from "vue";  // Import Vue 3
import { createPinia } from "pinia";  // Import Pinia for state management
import { useAuthStore } from "./stores/authStore"; // Import authStore from store

import router from "./router";  // Import Vue Router
import axios from 'axios'; // Import axios
import App from "./App.vue";  // Import root component (App.vue)

// Set up Axios instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Set base URL from environment variable
  });

// Add a request interceptor to add the token
instance.interceptors.request.use(
    function (config) {
        const userStore = useAuthStore();
        const token = userStore.token;
        if (token && token !== 'none') {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
  
// Add a response interceptor to handle authentication errors
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
        if (error.response.status === 401 || error.response.status === 498) {
            const userStore = useAuthStore();
            userStore.logout();
            router.push({ name: 'Login' }); // Redirect to login page
        }
        }
        return Promise.reject(error);
    }
);

const app = createApp(App);  // Create Vue app instance

// Provide Axios instance globally
app.provide('$axios', instance);

app.use(createPinia());  // Set up Pinia store
app.use(router);  // Set up router

app.mount("#app");  // Mount app to DOM
