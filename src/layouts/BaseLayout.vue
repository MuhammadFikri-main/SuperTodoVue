<script setup>
import { useTemplateStore } from "@/stores/template";
import BaseHeader from "@/components/BaseHeader.vue";
import BaseSidebar from "@/components/BaseSidebar.vue";
import BaseFooter from "@/components/BaseFooter.vue";

const store = useTemplateStore();
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div v-if="store.layout.header" class="bg-gray-800 text-black">
      <BaseHeader />
    </div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <div v-if="store.layout.sidebar" class="w-64 bg-gray-800 text-white">
        <BaseSidebar />
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-4 bg-gray-100">
        <router-view />
      </div>
    </div>

    <!-- Footer -->
    <div v-if="store.layout.footer" class="bg-gray-800 text-white">
      <BaseFooter />
    </div>
  </div>
</template>
