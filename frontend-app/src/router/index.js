import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import LoginView      from '@/views/LoginView.vue'
import NavigationView from '@/views/NavigationView.vue'
import DashboardView  from '@/views/DashboardView.vue'
import PatientsView   from '@/views/PatientsView.vue'
import GraphView      from '@/views/GraphView.vue'
import CalendarView   from '@/views/CalendarView.vue'
import ProfileView    from '@/views/ProfileView.vue'    

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    component: NavigationView,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
      },
      {
        path: 'patients',
        name: 'patients',
        component: PatientsView,
        meta: { requiresAuth: true }
      },
      {
        path: 'graph',
        name: 'graph',
        component: GraphView,
        meta: { requiresAuth: true }
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: CalendarView,
        meta: { requiresAuth: true }
      },
      { 
          path: 'profile',   
          name: 'profile',   
          component: ProfileView,   
          meta: { requiresAuth: true } 
     }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth     = useAuthStore()
  const loggedIn = auth.isAuth

  if (to.meta.requiresAuth && !loggedIn) {
    // Intentó acceder a ruta protegida sin token
    return next({ name: 'login' })
  }
  if (to.name === 'login' && loggedIn) {
    // Ya autenticado, no puede volver al login
    return next({ name: 'dashboard' })
  }
  next()
})

export default router
