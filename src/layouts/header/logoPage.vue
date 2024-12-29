<template>
    <div class="header-logo-wrapper col-auto p-0">
        <div class="logo-wrapper">
            <router-link to="/">
                <img class="img-fluid for-light" src="@/assets/images/logo/logo.png" alt="">
                <img class="img-fluid for-dark" src="@/assets/images/logo/logo-dark.png" alt="">
            </router-link></div>
        <div class="toggle-sidebar" @click="toggle_sidebar">
            <vue-feather class="status_toggle middle sidebar-toggle" type="align-center"></vue-feather></div>
      </div>
</template>
<script>
    export default{
        methods: {
      toggle_sidebar() {
        this.$store.dispatch('menu/opensidebar');
      },
    }, 
    }
</script>