<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Reactive state
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errorMessage = ref('')
const isLoading = ref(false) // Loading state

// Router instance
const router = useRouter()
const authStore = useAuthStore()

// Login method
const login = async () => {
  // Reset error message
  errorMessage.value = ''

  // Validate inputs
  if (!email.value || !password.value || !password_confirmation.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  // Set loading state to true
  isLoading.value = true

  try {
    // Send a POST request to the login API
    const response = await axios.post(import.meta.env.VITE_API_URL + '/login', {
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    // Handle successful login
    if (response.data.success) {
      // set token and user data in auth store
      authStore.setToken(response.data.token)
      authStore.setUser(response.data.user)

      // Redirect to a protected route or dashboard
      router.push('/dashboard')
    } else {
      // Handle login errors
      errorMessage.value = response.data.message || 'Login failed. Please try again.'
    }
  } catch (error) {
    // Handle API errors
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Login failed. Please try again.'
    } else {
      errorMessage.value = 'An error occurred. Please try again later.'
    }
  } finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto flex justify-center items-center h-screen">
    <div class="card bg-base-100 w-96 shadow-xl">
      <!-- Card Body -->
      <div class="card-body">
        <!-- Email Input -->
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          <input type="text" class="grow" placeholder="Email" v-model="email" />
        </label>

        <!-- Password Input -->
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input type="password" class="grow" placeholder="Password" v-model="password" />
        </label>

        <!-- Password Confirmation Input -->
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            type="password"
            class="grow"
            placeholder="Confirm Password"
            v-model="password_confirmation"
          />
        </label>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </div>

        <!-- Login Button -->
        <button class="btn btn-primary mt-4" :disabled="isLoading" @click="login">
          <span v-if="isLoading" class="loading loading-spinner"></span>
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </div>
  </div>
</template>
