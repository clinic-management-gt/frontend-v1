import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import LoginView from "@/views/LoginView.vue";
import NavigationView from "@/views/NavigationView.vue";
import DashboardView from "@/views/DashboardView.vue";
import PatientsView from "@/views/PatientsView.vue";
import GraphView from "@/views/GraphView.vue";
import CalendarView from "@/views/CalendarView.vue";
import ProfileView from "@/views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      component: NavigationView,
      redirect: "/dashboard",
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: DashboardView,
        },
        {
          path: "patients",
          name: "patients",
          component: PatientsView,
        },
        {
          path: "graph",
          name: "graph",
          component: GraphView,
        },
        {
          path: "calendar",
          name: "calendar",
          component: CalendarView,
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (auth.isAuth) {
    if (to.name == "login") {
      next("/");
      return;
    }
  } else if (to.name !== "login") {
    next("login");
    return;
  }
  next();
});

export default router;
