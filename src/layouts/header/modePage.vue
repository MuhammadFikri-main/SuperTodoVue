<template>
  <div class="mode">
    <vue-feather type="moon" v-show="mixLayout == 'light-only'" @click="customizeMixLayout('dark-only')"></vue-feather>
    <vue-feather type="moon" v-show="mixLayout == 'dark-only'" @click="customizeMixLayout('light-only')"></vue-feather>
  </div>
</template>
  
<script>
export default {
  name: 'modePage',
  data() {
    return {
      mixLayout: 'light-only',
    };
  },
  methods: {
    customizeMixLayout(val) {
      this.mixLayout = val;
      this.$store.dispatch('layout/setLayout', { class: val });
    },
  },
};
</script>