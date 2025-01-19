<script setup>
import Navbar from '@/components/Navbar.vue' // Import the Navbar component
import Footer from '@/components/Footer.vue' // Import the Footer component
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar and Main Content Container -->
    <div class="flex flex-1">
      <!-- Navbar (Left Side) -->
      <nav class="bg-base-200 p-4 w-64">
        <!-- Adjust width as needed -->
        <Navbar />
      </nav>

      <!-- Main Content (Right Side) -->
      <main class="flex-1 p-4">
        <router-view></router-view>
        <!-- This is where the nested routes will be rendered -->
      </main>
    </div>

    <!-- Footer (Bottom) -->
    <Footer />
  </div>
</template>
