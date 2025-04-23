import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CalendarView from '../views/CalendarView.vue'
import PatientsView from '../views/PatientsView.vue'
import GraphView from '../views/GraphView.vue'
import NavigationView from '../views/NavigationView.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
     history: createWebHistory(import.meta.env.BASE_URL),
     routes: [
          {
               path: '/',
               component: NavigationView,
               redirect: '/dashboard',
               children: [
                    {
                         path: '/dashboard',
                         component: DashboardView,
                    },
                    {
                         path: '/patients',
                         component: PatientsView,
                    },
                    {
                         path: '/graph',
                         component: GraphView,
                    },
                    {
                         path: '/calendar',
                         component: CalendarView,
                    },
               ]
          }, {
               path: '/login',
               name: 'login',
               component: LoginView
          },
     ]
})

// router.beforeEach(async (to, from, next) => {
//      const auth = useAuthStore()
//      if (auth.isAuth) {
//           if (to.name == 'login') {
//                next('/')
//                return
//           }
//      }
//      else if (to.name !== 'login') {
//           next('login')
//           return
//      }
//      next()
// })

export default router