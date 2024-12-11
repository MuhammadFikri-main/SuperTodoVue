// src/stores/template.js
import { defineStore } from "pinia";

export const useTemplateStore = defineStore({
  id: "template",
  state: () => ({
    layout: {
      header: true,
      sidebar: true,
      footer: true,
    },
  }),
  actions: {
    setLayout(payload) {
      this.layout.header = payload.header;
      this.layout.sidebar = payload.sidebar;
      this.layout.footer = payload.footer;
    },
  },
});
