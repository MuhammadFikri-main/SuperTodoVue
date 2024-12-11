<script setup>
import { useTemplateStore } from "@/stores/template";
import BaseHeader from "@/components/BaseHeader.vue";
import BaseSidebar from "@/components/BaseSidebar.vue";
import BaseFooter from "@/components/BaseFooter.vue";

const store = useTemplateStore();
const layout = store.layout;
</script>

<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 text-white">
        <ul>
          <li><router-link to="/page-one" class="block p-4">Page 1</router-link></li>
          <li><router-link to="/page-two" class="block p-4">Page 2</router-link></li>
          <li><router-link to="/page-three" class="block p-4">Page 3</router-link></li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 p-6">
        <router-view></router-view>
      </div>
    </div>
  </template>
  

  