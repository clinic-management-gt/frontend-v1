<template>
     <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
               <ul role="list" class="-mx-2 space-y-1">
                    <li v-for="(item, index) in navigationObject" :key="item">
                         <a v-if="!item.children" :href="item.href" @click="placeCurrent(item)" :class="[
                              item.current ? 'bg-bg-primary-color' : 'hover:bg-primary-color-variation-1',
                              'group flex gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold text-white'
                         ]">
                              <component :is="item.icon" class="h-6 w-6 shrink-0 text-white mr-2" aria-hidden="true" />
                              <span class="text-md">{{ $t(item.name) }}</span>
                         </a>
                         <div v-else>
                              <button
                                   :class="[openIndex === index ? 'bg-primary-color' : 'hover:bg-primary-color-variation-2', 'flex items-center w-full text-left rounded-md p-2 gap-x-1 text-sm leading-6 font-semibold text-white']"
                                   @click="toggleDisclosure(index)">
                                   <component :is="item.icon" class="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
                                   {{ $t(item.name) }}
                                   <chevron-right-icon
                                        :class="[(openIndex === index ? 'rotate-90' : ''), 'ml-auto h-5 w-5 shrink-0 text-white']"
                                        aria-hidden="true" />
                              </button>
                              <ul v-show="openIndex === index" class="mt-1 px-2">
                                   <li v-for="subItem in item.children" :key="subItem.name">
                                        <a :href="subItem.href" @click="placeCurrent(subItem, item)"
                                             :class="[subItem.current ? 'bg-emerald-600' : 'hover:bg-emerald-900', 'block rounded-md py-2 pl-4 flex text-sm leading-6 text-white space-x-4']">
                                             <component :is="subItem.icon" class="h-6 mr-1 w-6 shrink-0 text-white"
                                                  aria-hidden="true" />
                                             {{ $t(subItem.name) }}
                                        </a>
                                   </li>
                              </ul>
                         </div>
                    </li>
               </ul>
          </li>
          <div class="relative">
               <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-primary-color-variation-1" />
               </div>
          </div>
          <primary-button @click="logout">
               <x-circle-icon class="h-6 w-6 shrink-0 text-white"></x-circle-icon>
               <span class="text-md ml-2">{{ $t('general.exit') }}</span>
          </primary-button>
     </ul>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { HomeIcon, UserIcon, ChartBarIcon, CalendarIcon, XCircleIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const authStore = useAuthStore()

const logout = () => {
     authStore.logout()
}
const navigationObject = {
     dashboard: { name: 'dashboard.dashboard', href: '/dashboard', icon: HomeIcon, current: false },
     patients: { name: 'patients.patients', href: '/patients', icon: UserIcon, current: false },
     graph: { name: 'graph.graph', href: '/graph', icon: ChartBarIcon, current: false },
     calendar: { name: 'calendar.calendar', href: '/calendar', icon: CalendarIcon, current: false },
}
</script>
