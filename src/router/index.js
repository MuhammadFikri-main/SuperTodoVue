import { createRouter, createWebHistory } from "vue-router";
import Backend from "@/layouts/variations/Backend.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/",
    component: Backend,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "task",
        name: "Task",
        component: () => import("@/views/TaskView.vue"),
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
