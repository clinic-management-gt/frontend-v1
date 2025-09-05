<template>
  <div class="bg-gray-50">
    <RouterView />
    <patients-create-form-dialog
      v-if="showCreateFormDialog"
      :isOpen="showCreateFormDialog"
      @close="closeAllPatientDialog"
    />
    <notification-alert />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { usePatientsLogicStore } from "@stores/patientsLogicStore";

const patientsCreateFormDialog = defineAsyncComponent(
  () =>
    import(
      "@components/patientsDialogsComponents/PatientsCreateFormDialog.vue"
    ),
);
const NotificationAlert = defineAsyncComponent(
  () => import("@components/forms/NotificationAlert.vue"),
);

const patientsLogicStore = usePatientsLogicStore();
const { closeAllPatientDialog } = patientsLogicStore;
const { showCreateFormDialog } = storeToRefs(patientsLogicStore);

// Considering in case we want that every certain amount of time, the page will logout for security reasons
// This includes no intervention of the user on the screen during x amount of time.
// If the user closes the window it wont logout because of pinia persist.
// I want to keep this piece of code here <3 don't touch it tks
// import { useAuthStore } from '@/stores/authStore'

// let inactivityTimer

// const INACTIVITY_LIMIT = 15 * 60 * 1000 // 15 minutos

// function resetInactivityTimer() {
//   clearTimeout(inactivityTimer)
//   inactivityTimer = setTimeout(() => {
//     const authStore = useAuthStore()
//     authStore.logout()
//     window.location.href = '/login'
//     alert('Sesión cerrada por inactividad.')
//   }, INACTIVITY_LIMIT)
// }

// // Escucha interacciones del usuario
// ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
//   window.addEventListener(event, resetInactivityTimer)
// })

// // Inicia temporizador al cargar la app
// resetInactivityTimer()
</script>
