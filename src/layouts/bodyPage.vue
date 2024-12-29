
<template>
    <TapTop />
    <div class="loader-wrapper" :class="{ 'loderhide': !show }">
      <div class="loader-index">
  
      </div>
    </div>
  
    <div class="page-wrapper null" :class="this.sidebar == 'horizontal-wrapper' ? 'horizontal-wrapper' : 'compact-wrapper'"
      id="pageWrapper">
      <div class="page-header" :class="{ close_icon: !togglesidebar }">
        <Header />
      </div>
      <div class="page-body-wrapper">
        <div class="bg-overlay" :class="{ active: activeoverlay }" @click="removeoverlay()"></div>
        <div class="sidebar-wrapper" :class="[{ close_icon: !togglesidebar }]"
          :sidebar-layout="layout.settings.sidebar_setting">
          <Sidebar @clicked="sidebar_toggle" />
        </div>
        <div class="page-body" @click="hidesecondmenu()">
          <transition name="fadeIn" enter-active-class="animated fadeIn">
            <router-view class="view"></router-view>
          </transition>
        </div>
        <Footer />
      </div>
      <Customizer />
  
    </div>
</template>
    
  <script>
//   import { mapState, mapGetters } from 'vuex';
  import { layoutClasses } from '../constants/layout';
  import Header from '../layouts/header/index.vue';
//   import Sidebar from '../layout/sidebar/indexView.vue';
//   import Footer from '../layout/footerView.vue';
//   import Customizer from '../layout/customizer/indexPage.vue';
//   import TapTop from './tapTop.vue';
  
  export default {
  
    components: {
      Header,
    //   Sidebar,
    //   Footer,
    //   Customizer,
    //   TapTop
    },
    data() {
      return {
        mobileheader_toggle_var: false,
        sidebar_toggle_var: false,
        horizontal_Sidebar: true,
        resized: false,
        layoutobj: {}, show: true
      };
    },
    computed: {
    //   ...mapState({
    //     menuItems: state => state.menu.data,
    //     layout: state => state.layout.layout,
    //     togglesidebar: (state) => state.menu.togglesidebar,
    //     activeoverlay: (state) => state.menu.activeoverlay
    //   }),
    //   ...mapGetters({
    //     sidebar: 'layout/sidebar'
    //   }),
      layoutobject: {
        get: function () {
          return JSON.parse(JSON.stringify(layoutClasses.find((item) => Object.keys(item).pop() === this.layout.settings.layout)))[this.layout.settings.layout];
        },
        set: function () {
          this.layoutobj = layoutClasses.find((item) => Object.keys(item).pop() === this.layout.settings.layout);
          this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[this.layout.settings.layout];
          return this.layoutobj;
        }
      }
    },
    watch: {
      '$route'() {
        this.menuItems.filter(items => {
          if (items.path === this.$route.path)
            this.$store.dispatch('menu/setActiveRoute', items);
          if (!items.children) return false;
          items.children.filter(subItems => {
            if (subItems.path === this.$route.path)
              this.$store.dispatch('menu/setActiveRoute', subItems);
            if (!subItems.children) return false;
            subItems.children.filter(subSubItems => {
              if (subSubItems.path === this.$route.path)
                this.$store.dispatch('menu/setActiveRoute', subSubItems);
            });
          });
        });
        this.layoutobj = layoutClasses.find((item) => Object.keys(item).pop() === this.layout.settings.layout);
        if ((window.innerWidth < 1199 && this.layout.settings.layout === 'LosAngeles') || (window.innerWidth < 1199 && this.layout.settings.layout === 'Singapore') || (window.innerWidth < 1199 && this.layout.settings.layout === 'Barcelona')) {
          const newlayout = JSON.parse(JSON.stringify(this.layoutobj).replace('horizontal-wrapper', 'compact-wrapper'));
          this.layoutobj = JSON.parse(JSON.stringify(newlayout))[this.layout.settings.layout];
        } else {
          this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[this.layout.settings.layout];
        }
      },
      sidebar_toggle_var: function () {
        this.resized = (this.width <= 1199) ? !this.sidebar_toggle_var : this.sidebar_toggle_var;
      }
    },
    mounted() {
      this.timeOut();
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
      this.resized = this.sidebar_toggle_var;
      this.$store.dispatch('layout/set');
  
      this.layout.settings.layout = this.$route.query.layout ? this.$route.query.layout : 'Dubai';
      this.layoutobj = layoutClasses.find((item) => Object.keys(item).pop() === this.layout.settings.layout);
      this.layoutobj = JSON.parse(JSON.stringify(this.layoutobj))[this.layout.settings.layout];
    },
    methods: {
      timeOut() {
        var self = this;
        setTimeout(function () {
          self.show = false;
        }, 1000);
      },
      sidebar_toggle(value) {
        this.sidebar_toggle_var = !value;
      },
      mobiletoggle_toggle(value) {
        this.mobileheader_toggle_var = value;
      },
      handleResize() {
        this.$store.dispatch('menu/resizetoggle');
      },
      removeoverlay() {
        this.$store.state.menu.activeoverlay = false;
        if (window.innerWidth < 1199) {
          this.$store.state.menu.togglesidebar = false;
        }
        this.menuItems.filter(menuItem => {
          menuItem.active = false;
        });
      },
      hidesecondmenu() {
        if (this.layoutobject.split(' ').includes('compact-sidebar')) {
          this.menuItems.filter(menuItem => {
            menuItem.active = false;
          });
        }
        if (window.innerWidth < 1199) {
          this.$store.state.menu.togglesidebar = false;
        }
      }
    }
  };
  </script>
  <style lang="scss" scoped>
  .loader-wrapper.loderhide {
    display: none;
  }
  </style>
    
    