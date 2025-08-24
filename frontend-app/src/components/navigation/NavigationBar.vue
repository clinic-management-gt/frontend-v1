<template>
  <ul role="list" class="flex flex-1 flex-col gap-y-7">
    <li>
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="(item, key) in navigationObject" :key="key">
          <!-- Item simple -->
          <RouterLink
            v-if="!item.children"
            :to="item.to"
            :data-testid="`nav-${key}`"
            :class="[
              item.current ? 'bg-bg-primary-color' : 'hover:bg-primary-color-variation-1',
              'group flex gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold text-white'
            ]"
          >
            <component :is="item.icon" class="h-6 w-6 shrink-0 text-white mr-2" aria-hidden="true" />
            <span class="text-md">{{ $t(item.name) }}</span>
          </RouterLink>

          <!-- Con subitems (si los usas) -->
          <div v-else>
            <!-- botón del disclosure -->
            <!-- ... -->
            <ul v-show="openIndex === key" class="mt-1 px-2">
              <li v-for="(subItem, subKey) in item.children" :key="subKey">
                <RouterLink
                  :to="subItem.to"
                  :data-testid="`nav-${key}-${subKey}`"
                  :class="[
                    subItem.current ? 'bg-emerald-600' : 'hover:bg-emerald-900',
                    'block rounded-md py-2 pl-4 flex text-sm leading-6 text-white space-x-4'
                  ]"
                >
                  <component :is="subItem.icon" class="h-6 mr-1 w-6 shrink-0 text-white" aria-hidden="true" />
                  {{ $t(subItem.name) }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </li>
    <!-- botón logout… -->
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { HomeIcon, UserIcon, ChartBarIcon, CalendarIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const logout = () => authStore.logout()

// Usa `to` en vez de `href`
const navigationObject = {
  dashboard: { name: 'dashboard.dashboard', to: '/dashboard', icon: HomeIcon, current: false },
  patients:  { name: 'patients.patients',   to: '/patients',  icon: UserIcon, current: false },
  graph:     { name: 'graph.graph',         to: '/graph',     icon: ChartBarIcon, current: false },
  calendar:  { name: 'calendar.calendar',   to: '/calendar',  icon: CalendarIcon, current: false },
}

const openIndex = ref(null)
</script>
