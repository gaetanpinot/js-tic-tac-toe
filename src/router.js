import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import { isAuthenticated } from "@/services/AuthProvider.js";
import DashBoard from "@/components/DashBoard.vue";
import ModifierProfile from "@/components/ModifierProfile.vue";
import Game from "@/components/Game.vue";

const routes = [
  { path: "/", component: DashBoard, meta: { requiresAuth: true } },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/change",
    name: "ChangeProfile",
    component: ModifierProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/game/:id",
    name: "PlayGame",
    component: Game,
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from) => {
  const isLogged = isAuthenticated();
  if (to.meta.requiresAuth && !isLogged) {
    router.push({ name: "Login" });
    return false;
  }
  return true;
});
export { router };
