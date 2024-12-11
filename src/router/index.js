import { createRouter, createWebHistory } from "vue-router";
import Backend from "@/layouts/variations/Backend.vue";

const routes = [
  {
    path: "/",
    redirect: "/page-one",
  },
  {
    path: "/",
    component: Backend,
    children: [
      {
        path: "page-one",
        name: "PageOne",
        component: () => import("@/views/PageOne.vue"),
      },
      {
        path: "page-two",
        name: "PageTwo",
        component: () => import("@/views/PageTwo.vue"),
      },
      {
        path: "page-three",
        name: "PageThree",
        component: () => import("@/views/PageThree.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
