<template>
  <div class="left-header col horizontal-wrapper ps-0">
    <div class="input-group">
      <input class="form-control" :class="filtered ? 'open' : ''" type="text" placeholder="Search Here........"
        v-on:keyup="$store.dispatch('menu/searchTerm', terms)" v-model="terms"><span
        class="input-group-text mobile-search"><vue-feather type="search" @click="collapseFilter()"></vue-feather></span>
    </div>
    <div :class="searchResult ? 'Typeahead-menu is-open' : 'Typeahead-menu'" v-if="menuItems.length">
      <div class="ProfileCard u-cf" v-for="(menuItem, index) in menuItems.slice(0, 8)" :key="index">
        <div class="ProfileCard-avatar header-search">
          <vue-feather :type="menuItem.icon"></vue-feather>
        </div>
        <router-link :to="menuItem.path">
          <div class="ProfileCard-details">
            <div class="ProfileCard-realName">
              <span @click="removeFix()">{{ menuItem.title }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div :class="
      searchResultEmpty ? 'Typeahead-menu is-open' : 'Typeahead-menu'
    ">
      <div class="tt-dataset tt-dataset-0">
        <div class="EmptyMessage">
          Your search turned up 0 results. Opps There are no result found.
        </div>
      </div>
    </div>
  </div>
</template>
<script>

// import { mapState } from 'vuex'
export default {
  name: 'searchPage',
  data() {
    return {
      terms: '',
      filtered: false,
      searchResult: false,
      searchResultEmpty: false,
    };
  },
  computed: {
    // ...mapState({
    //   menuItems: (state) => state.menu.searchData,

    // }),
  },
  watch: {
    menuItems: function () {
      this.terms ? this.addFix() : this.removeFix();
      if (!this.menuItems.length) this.searchResultEmpty = true;
      else this.searchResultEmpty = false;
    },
  },
  methods: {
    collapseFilter() {
      this.filtered = !this.filtered;
    },
    search_open() {
      this.$store.state.menu.searchOpen = true;
    },
    search_close() {
      this.$store.state.menu.searchOpen = false;
    },
    searchterm: function () {
      this.$store.dispatch('menu/searchTerm', this.terms);
    },
    addFix() {

      this.searchResult = true;
    },
    removeFix() {

      this.searchResult = false;
      this.terms = '';
    },
  },
}
</script>