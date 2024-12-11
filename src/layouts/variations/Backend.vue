<script setup>
import { useTemplateStore } from "@/stores/template";  // Import the store to manage layout
import BaseLayout from "@/layouts/BaseLayout.vue";  // Import BaseLayout component

// Main store for layout management
const store = useTemplateStore();

// Set the default layout elements for this page (you can change this based on the page)
store.setLayout({
  header: true,  // Enable the header
  sidebar: true,  // Enable the sidebar
  sideOverlay: true,  // Enable the side overlay
  footer: true,  // Enable the footer
});

// Set layout variations if needed (e.g., narrow content)
// store.mainContent({ mode: "narrow" });
</script>

<template>
  <!-- Use BaseLayout as the wrapper for the page layout -->
  <BaseLayout>
    <!-- Main content for the Backend page -->
    <template #page-top-content>
      <h1 class="text-3xl font-bold">Backend Page</h1>
    </template>

    <!-- Render other content here -->
    <p class="mt-4">This is the Backend page content.</p>
  </BaseLayout>
</template>

<style scoped>
/* Additional styles for Backend.vue page, if needed */
</style>
