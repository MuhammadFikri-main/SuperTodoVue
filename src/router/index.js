import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import the auth store
import BaseLayout from '@/layouts/BaseLayout.vue' // Import the base layout

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'), // Login page (no layout)
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: '/', // Redirect to the login page
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore() // Import and use the Pinia store
        authStore.logout() // Clear the token
        next('/') // Redirect to the login page
      },
    },
    {
      path: '/',
      component: BaseLayout, // Base layout for main pages
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'), // Home page
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/AboutView.vue'), // About page
        },
        {
          path: 'task',
          name: 'task',
          component: () => import('@/views/TaskView.vue'), // Task page
        },
      ],
    },
  ],
})

export default router
