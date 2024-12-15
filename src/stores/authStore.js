import { defineStore } from 'pinia';
import { errorMessages } from 'vue/compiler-sfc';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    token: null,
    user: null,
    errorMessages: null
  }),
  actions: {
    setAuth(token, user) {
      this.isLoggedIn = true;
      this.token = token;
      this.user = user;

      // Persist token and user in localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;

      // Clear from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    isAuthenticated() {
      // Check if token and user are available
      return !!this.token && !!this.user;
    },
    setErrorMessage(message) {
        this.errorMessage = message;
    },
  },
});
