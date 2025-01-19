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
//add task function
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
    fetchTasks() // Fetch tasks again to update the list
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
    authStore.clearToken() // Clear auth state in Pinia store
    displayToast('You are not authorized. Please log in.', 'error') // Show unauthorized toast
    router.push('/') // Redirect to login page
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
            <span class="badge badge-xs badge-info p-2">{{ task.status }}</span>
            <a class="flex items-center gap-2" @click="deleteTask(task)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
