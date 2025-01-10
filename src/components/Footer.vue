<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear(), // Get the current year
    }
  },
}
</script>
<template>
  <footer class="footer footer-center bg-base-300 text-base-content p-4">
    <aside>
      <p>Copyright © {{ currentYear }} - All right reserved by UDTS</p>
    </aside>
  </footer>
</template>
