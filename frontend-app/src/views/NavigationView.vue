<template>
     <div>
          <!-- Barra lateral y navegación principal de la app -->
          <TransitionRoot as="template" :show="sidebarOpen">
               <!-- Diálogo para la barra lateral en pantallas pequeñas -->
               <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                    <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                         enter-from="opacity-0" enter-to="opacity-100"
                         leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                         leave-to="opacity-0">
                         <div class="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>
                    <div class="fixed inset-0 flex">
                         <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                              enter-from="-translate-x-full" enter-to="translate-x-0"
                              leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                              leave-to="-translate-x-full">
                              <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                                   <TransitionChild as="template" enter="ease-in-out duration-300"
                                        enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300"
                                        leave-from="opacity-100" leave-to="opacity-0">
                                        <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                             <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                                  <span class="sr-only">Close sidebar</span>
                                                  <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                                             </button>
                                        </div>
                                   </TransitionChild>
                                   <!-- Contenido de la barra lateral -->
                                   <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-color px-6 pb-4">
                                        <div class="flex h-18 shrink-0 items-center bg-white rounded-full mt-2">
                                             <img class="h-16 w-auto mx-auto mt-2" src="/logo-gastro.png"
                                                  alt="Logo Gastro" />
                                        </div>
                                        <nav class="flex flex-1 flex-col">
                                             <!-- Componente de navegación lateral -->
                                             <NavigationBar />
                                        </nav>
                                   </div>
                              </DialogPanel>
                         </TransitionChild>
                    </div>
               </Dialog>
          </TransitionRoot>

          <!-- Barra lateral estática para escritorio -->
          <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
               <div
                    class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-color align-center justify-center min-h-screen px-6 pb-4">
                    <div class="flex h-18 shrink-0 items-center bg-white rounded-full mt-2">
                         <img class="h-16 w-auto mx-auto mt-2" src="/logo-gastro.png" alt="Logo Gastro" />
                    </div>
                    <nav class="flex flex-1 flex-col">
                         <NavigationBar />
                    </nav>
               </div>
          </div>

          <!-- Barra superior y contenido principal -->
          <div class="lg:pl-72">
               <div
                    class="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <!-- Botón para abrir la barra lateral en móvil -->
                    <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                         <span class="sr-only">Open sidebar</span>
                         <Bars3Icon class="size-6" aria-hidden="true" />
                    </button>

                    <!-- Separador visual -->
                    <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                    <!-- Buscador de pacientes en la barra superior -->
                    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                         <!-- Formulario de búsqueda con autocompletado -->
                         <form class="grid flex-1 grid-cols-1" action="#" method="GET">
                              <!-- Componente de autocompletado para buscar pacientes -->
                              <combo-box-autocomplete-input
                                   :data="allPatients"
                                   v-model:currentSelected="currentPatientSelectedId"
                                   class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
                                   :placeholder="$t('general.search-patient')"
                              />
                              <!-- Icono de lupa sobre el input -->
                              <MagnifyingGlassIcon
                                   class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                                   aria-hidden="true"
                              />
                         </form>
                         <div class="flex items-center gap-x-4 lg:gap-x-6">
                              <!-- Separador visual -->
                              <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                              <!-- Menú de perfil de usuario -->
                              <Menu as="div" class="relative">
                                   <MenuButton class="-m-1.5 flex items-center p-1.5">
                                        <span class="hidden lg:flex lg:items-center">
                                             <span class="ml-4 text-sm/6 font-semibold text-gray-900"
                                                  aria-hidden="true">Dra. Flor Ramírez</span>
                                             <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                   </MenuButton>
                                   <transition enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95">
                                        <MenuItems
                                             class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                             <MenuItem v-for="item in userNavigation" :key="item.name"
                                                  v-slot="{ active }">
                                             <a :href="item.href"
                                                  :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']">{{
                                                  item.name }}</a>
                                             </MenuItem>
                                        </MenuItems>
                                   </transition>
                              </Menu>
                         </div>
                    </div>
               </div>

               <!-- Contenido principal de la página -->
               <main class="h-[calc(100vh-5rem)] overflow-auto">
                    <div class="h-full">
                         <router-view />
                    </div>
               </main>
          </div>
     </div>
</template>

<script setup>
// Este archivo define la vista principal de navegación, incluyendo la barra lateral y la barra superior.
// Aquí se importa el store de pacientes para alimentar el autocompletado de búsqueda.

import { ref } from 'vue'
import {
     Dialog,
     DialogPanel,
     Menu,
     MenuButton,
     MenuItem,
     MenuItems,
     TransitionChild,
     TransitionRoot,
} from '@headlessui/vue'
import { ChevronDownIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/20/solid'
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/navigation/NavigationBar.vue'
import ComboBoxAutocompleteInput from '@/components/forms/ComboBoxAutocompleteInput.vue'
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '@/stores/patientsStore'

// Se obtiene el store de pacientes y sus referencias reactivas
const patientsStore = usePatientsStore()
const { allPatients, currentPatientSelectedId } = storeToRefs(patientsStore)

// Opciones del menú de usuario
const userNavigation = [
     { name: 'Your profile', href: '#' },
     { name: 'Sign out', href: '#' },
]

// Estado para mostrar/ocultar la barra lateral en móvil
const sidebarOpen = ref(false)
</script>