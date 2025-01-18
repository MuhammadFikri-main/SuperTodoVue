<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Router instance
const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const tasks = ref([])
const newTask = ref({
  title: '',
  description: 'description',
})
const isLoading = ref(false) // Loading state
const toastMessage = ref('') // Toast message
const toastType = ref('') // Toast type: 'success', 'error', etc.
const showToast = ref(false) // Control toast visibility

// Show toast function
const displayToast = (message, type = 'success', duration = 3000) => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Hide toast after duration
  setTimeout(() => {
    showToast.value = false
  }, duration)
}

// Fetch tasks when the component is mounted
onMounted(async () => {
  await fetchTasks()
})

// Fetch tasks from the backend
const fetchTasks = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/task', {
      headers: {
        Authorization: `Bearer ${authStore.token}`, // Include the token
      },
    })
    tasks.value = response.data.task // Update tasks with the fetched data
  } catch (error) {
    handleApiError(error, 'Failed to fetch tasks.')
  } finally {
    isLoading.value = false
  }
}

// Add a new task
const addTask = async () => {
  if (!newTask.value.title.trim()) {
    displayToast('Task title cannot be empty.', 'error') // Show error toast
    return
  }

  isLoading.value = true
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + '/task',
      {
        title: newTask.value.title,
        description: newTask.value.description,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // Include the token
        },
      },
    )
    tasks.value.push(response.data.task) // Add the new task to the list
    newTask.value.title = ''
    newTask.value.description = ''
    displayToast('Task added successfully!', 'success') // Show success toast
  } catch (error) {
    handleApiError(error, 'Failed to add task.') // Handle API error
  } finally {
    isLoading.value = false
  }
}

// Toggle task completion status
const toggleTaskCompletion = async (task) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_API_URL + `/task/${task.id}`,
      {
        completed: !task.completed,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // Include the token
        },
      },
    )
    task.completed = response.data.task.completed // Update task completion status
    displayToast('Task status updated!', 'success') // Show success toast
  } catch (error) {
    handleApiError(error, 'Failed to update task.') // Handle API error
  }
}

// Delete a task
const deleteTask = async (task) => {
  try {
    await axios.delete(import.meta.env.VITE_API_URL + `/task/${task.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`, // Include the token
      },
    })
    tasks.value = tasks.value.filter((t) => t.id !== task.id) // Remove the deleted task
    displayToast('Task deleted successfully!', 'success') // Show success toast
  } catch (error) {
    handleApiError(error, 'Failed to delete task.') // Handle API error
  }
}

// Handle API errors
const handleApiError = (error, defaultMessage) => {
  if (error.response?.status === 401) {
    // Unauthorized: Redirect to login page
    authStore.clearAuth() // Clear auth state in Pinia store
    displayToast('You are not authorized. Please log in.', 'error') // Show unauthorized toast
    router.push('/login') // Redirect to login page
  } else {
    // Display error message
    const errorMessage = error.response?.data?.message || defaultMessage
    displayToast(errorMessage, 'error') // Show error toast
  }
}
</script>

<template>
  <div class="container mx-auto flex justify-center items-center h-screen">
    <!-- DaisyUI Toast -->
    <div v-if="showToast" class="toast toast-top toast-end">
      <div :class="['alert', `alert-${toastType}`]">
        <span>{{ toastMessage }}</span>
      </div>
    </div>

    <!-- Task Management Card -->
    <div class="card bg-base-100 w-96 shadow-xl">
      <!-- Card Body -->
      <div class="card-body">
        <!-- Task and Add Button -->
        <div class="flex flex-row items-center gap-2">
          <label class="input input-bordered flex items-center gap-2 grow">
            <input
              type="text"
              class="grow"
              placeholder="Add Task"
              v-model="newTask.title"
              @keyup.enter="addTask"
            />
          </label>
          <button class="btn btn-primary" :disabled="isLoading" @click="addTask">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            {{ isLoading ? 'Adding...' : 'Add' }}
          </button>
        </div>

        <!-- Task List -->
        <div class="mt-4 flex flex-col gap-4">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="form-control flex flex-row items-center gap-2"
          >
            <input
              type="checkbox"
              :checked="task.completed"
              class="checkbox"
              @change="toggleTaskCompletion(task)"
            />
            <p class="text-sm">{{ task.title }}</p>
            <a class="flex items-center gap-2" @click="deleteTask(task)">
              Delete
              <span class="badge badge-xs badge-info"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
