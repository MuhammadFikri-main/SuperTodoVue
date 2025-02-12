<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Router instance
const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const state = reactive({
  tasks: [],
  newTask: {
    title: '',
    description: 'description',
  },
  isLoading: false,
  toast: {
    message: '',
    type: '', // 'success', 'error', etc.
    visible: false,
  },
})

// Show toast function
const displayToast = (message, type = 'success', duration = 3000) => {
  state.toast.message = message
  state.toast.type = type
  state.toast.visible = true

  // Hide toast after duration
  setTimeout(() => {
    state.toast.visible = false
  }, duration)
}

// Fetch tasks from the backend
const fetchTasks = async () => {
  state.isLoading = true
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/getListOfTasks', {
      headers: {
        Authorization: `Bearer ${authStore.token}`, // Include the token
      },
    })
    state.tasks = response.data.task // Update tasks with the fetched data
  } catch (error) {
    handleApiError(error, 'Failed to fetch tasks.')
  } finally {
    state.isLoading = false
  }
}

// Fetch tasks when the component is mounted
onMounted(fetchTasks)

// Add a new task (Optimistic UI)
const addTask = async () => {
  if (!state.newTask.title.trim()) {
    displayToast('Task title cannot be empty.', 'error') // Show error toast
    return
  }

  const tempId = Date.now() // Temporary ID for optimistic update
  const optimisticTask = {
    id: tempId,
    title: state.newTask.title,
    description: state.newTask.description,
    isTemporary: true, // Flag to identify temporary tasks
  }

  // Optimistically add task to UI
  state.tasks.push(optimisticTask)

  state.isLoading = true
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + '/task',
      {
        title: state.newTask.title,
        description: state.newTask.description,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // Include the token
        },
      },
    )

    // Replace the temporary task with the real one from API
    state.tasks = state.tasks.map((task) => (task.id === tempId ? response.data.task : task))

    state.newTask.title = ''
    state.newTask.description = ''
    displayToast('Task added successfully!', 'success') // Show success toast
    fetchTasks() // Fetch tasks again to get the updated list
  } catch (error) {
    // Rollback UI changes if API request fails
    state.tasks = state.tasks.filter((task) => task.id !== tempId)
    handleApiError(error, 'Failed to add task.')
  } finally {
    state.isLoading = false
  }
}

// Toggle task completion status
const toggleTaskCompletion = async (task) => {
  const updatedStatus = task.status === 'completed' ? 'On-Going' : 'completed' // Toggle status

  try {
    const response = await axios.put(
      import.meta.env.VITE_API_URL + `/task/${task.id}`,
      {
        title: task.title, // Keep existing title
        description: task.description, // Keep existing description
        status: updatedStatus, // Toggle status
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // Include the token
        },
      },
    )

    // Update UI optimistically
    task.status = response.data.task.status
    fetchTasks() // Fetch tasks again to get the updated list
    displayToast('Task status updated!', 'success')
  } catch (error) {
    handleApiError(error, 'Failed to update task.')
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
    state.tasks = state.tasks.filter((t) => t.id !== task.id) // Remove the deleted task
    displayToast('Task deleted successfully!', 'success')
  } catch (error) {
    handleApiError(error, 'Failed to delete task.')
  }
}

// Handle API errors
const handleApiError = (error, defaultMessage) => {
  if (error.response?.status === 401) {
    // Unauthorized: Redirect to login page
    authStore.clearToken() // Clear auth state in Pinia store
    displayToast('You are not authorized. Please log in.', 'error')
    router.push('/') // Redirect to login page
  } else {
    // Display error message
    const errorMessage = error.response?.data?.message || defaultMessage
    displayToast(errorMessage, 'error')
  }
}
</script>

<template>
  <div class="container mx-auto flex justify-center items-center h-screen">
    <!-- Toast Notification -->
    <div v-if="state.toast.visible" class="toast toast-top toast-end">
      <div :class="['alert', `alert-${state.toast.type}`]">
        <span>{{ state.toast.message }}</span>
      </div>
    </div>

    <!-- Task Management Card -->
    <div class="card bg-base-100 w-96 shadow-xl">
      <div class="card-body">
        <!-- Task and Add Button -->
        <div class="flex flex-row items-center gap-2">
          <label class="input input-bordered flex items-center gap-2 grow">
            <input
              type="text"
              class="grow"
              placeholder="Add Task"
              v-model="state.newTask.title"
              @keyup.enter="addTask"
            />
          </label>
          <button class="btn btn-primary" :disabled="state.isLoading" @click="addTask">Add</button>
        </div>

        <!-- Task List -->
        <div class="mt-4 flex flex-col gap-4">
          <div
            v-for="task in state.tasks"
            :key="task.id"
            class="form-control flex flex-row items-center gap-2"
          >
            <input
              type="checkbox"
              :checked="task.status === 'completed'"
              class="checkbox"
              @change="toggleTaskCompletion(task)"
            />

            <p class="text-sm">{{ task.title }}</p>
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="badge badge-xs badge-info p-2">
                {{ task.status }}
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li><a>On-Going</a></li>
                <li><a>Skip</a></li>
              </ul>
            </div>
            <a class="flex items-center gap-2" onclick="editTaskModal.showModal()">
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM16.862 4.487L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </a>
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
