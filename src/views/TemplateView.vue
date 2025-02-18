<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const addTemplateModal = ref(null)
const templateDetailModal = ref(null)

// Router instance
const router = useRouter()
const authStore = useAuthStore()

// reactive state
const state = reactive({
  toast: {
    message: '',
    type: '',
    visible: false,
  },
  isLoading: false,
  isModalOpen: false,
  templates: [],
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

const formattedTemplates = computed(() =>
  state.templates.map((template) => ({
    ...template,
    is_public: template.is_public ? 'public' : 'private',
    user: {
      ...template.user,
      name: template.user?.name ?? 'Unknown',
    },
  })),
)

const openAddTemplateModal = () => {
  state.isModalOpen = true
  addTemplateModal.value?.showModal() // Open modal
}

const closeAddTemplateModal = () => {
  state.isModalOpen = false
  addTemplateModal.value?.close() // Close modal
}

const openTemplateDetailModal = () => {
  state.isModalOpen = true
  templateDetailModal.value?.showModal() // Open modal
}

const closeTemplateDetailModal = () => {
  state.isModalOpen = false
  templateDetailModal.value?.close() // Close modal
}

const fetchTemplates = async () => {
  state.isLoading = true

  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/getListOfTemplates', {
      headers: {
        Authorization: `Bearer ${authStore.token}`, // Include the token
      },
    })

    state.templates = response.data.template
  } catch (error) {
    handleApiError(error, 'Failed to fetch tasks.')
  } finally {
    state.isLoading = false
  }
}

onMounted(fetchTemplates)
</script>

<template>
  <div class="container mx-auto flex justify-center items-center h-screen">
    <!-- Toast Notification -->
    <div v-if="state.toast.visible" class="toast toast-top toast-end">
      <div :class="['alert', `alert-${state.toast.type}`]">
        <span>{{ state.toast.message }}</span>
      </div>
    </div>

    <div class="card bg-base-100 w-auto shadow-xl">
      <div class="card-body">
        <h2 class="card-title">List of Templates</h2>
        <button class="btn" @click="openAddTemplateModal()">Add Template</button>
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>Template</th>
                <th>Total Task</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <tr v-for="template in formattedTemplates" :key="template.id">
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="mask mask-squircle h-12 w-12">
                        <img
                          src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ template.user.name }}</div>
                      <div class="text-sm opacity-50">{{ template.description }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {{ template.title }}
                  <br />
                  <span class="badge badge-ghost badge-sm">{{ template.is_public }}</span>
                </td>
                <td>{{ template.tasks_count }}</td>
                <th>
                  <button class="btn btn-ghost btn-xs" @click="openTemplateDetailModal()">
                    details
                  </button>
                </th>
              </tr>
            </tbody>
            <!-- foot -->
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Template</th>
                <th>Total</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <dialog ref="addTemplateModal" class="modal">
      <div class="modal-box card card-compact bg-base-100 w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Add Template</h2>

          <div class="card-actions justify-end">
            <button class="btn btn-secondary" @click="closeAddTemplateModal">Cancel</button>
            <button class="btn btn-secondary" @click="saveTemplate">Save</button>
          </div>
        </div>
      </div>
    </dialog>

    <dialog ref="templateDetailModal" class="modal">
      <div class="modal-box card card-compact bg-base-100 w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Task Details</h2>

          <div class="card-actions justify-end">
            <button class="btn btn-secondary" @click="closeTemplateDetailModal">Cancel</button>
            <button class="btn btn-secondary" @click="saveTemplate">Save</button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
