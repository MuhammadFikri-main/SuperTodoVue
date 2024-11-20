<script>
import { useTemplateStore } from '@/stores/templateStore';

export default {
  setup() {
    const templateStore = useTemplateStore();

    return {
      templates: templateStore.templates,
      isLoading: templateStore.isLoading,
      error: templateStore.error,
      fetchPublicTemplates: templateStore.fetchPublicTemplates,
      useTemplate: templateStore.useTemplate,
    };
  },
  mounted() {
    this.fetchPublicTemplates();
  },
  methods: {
    async handleUseTemplate(templateId) {
      const success = await this.useTemplate(templateId);
      if (success) {
        alert('Template tasks added to your task list!');
      }
    },
  },
};
</script>

<template>
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">Public Templates</h1>
  
      <div v-if="isLoading" class="text-center">
        <p>Loading templates...</p>
      </div>
  
      <div v-if="error" class="text-red-500">
        <p>{{ error }}</p>
      </div>
  
      <div v-if="!isLoading && templates.length === 0" class="text-center">
        <p>No public templates found.</p>
      </div>
  
      <div v-if="!isLoading && templates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="border rounded-lg p-4 bg-white shadow-md"
        >
          <h2 class="text-lg font-semibold">{{ template.title }}</h2>
          <p class="text-gray-500">{{ template.description }}</p>
  
          <button
            @click="handleUseTemplate(template.id)"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
</template>
  
<style scoped>
  /* Add any additional styling if needed */
</style>
  