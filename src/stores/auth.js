import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token'), // retrieve token from local storage
    user: null, // store user data
  }),

  actions: {
    // set token
    setToken(token) {
      this.token = token
      localStorage.setItem('auth_token', token)
    },

    // clear token
    clearToken() {
      this.token = null
      localStorage.removeItem('auth_token')
    },

    // set user data
    setUser(user) {
      this.user = user
    },

    logout() {
      this.clearToken()
      this.setUser(null)

      // redirect to login page
      const router = useRouter()
      router.push({ name: 'login' })
    },

    // check if the user is authenticated
    isAuthenticated() {
      return this.token !== null
    },

    // initialize the store
    initialized() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.setToken(token)
      }
    },
  },
})
