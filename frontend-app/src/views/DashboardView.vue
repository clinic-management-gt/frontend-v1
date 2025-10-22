<template>
  <div class="px-6 py-8 mx-auto">
    <!-- Botón para agendar nueva cita -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-back ">
        Pacientes para hoy — {{ todayFormatted }}
      </h1>
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="openAppointmentModal"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {{ $t("dashboard.schedule-appointment") }}
      </button>
    </div>

    <!-- Componente de citas del día -->
    <today-patients />

    <!-- Modal de agendamiento -->
    <appointment-modal
      :isOpen="isAppointmentModalOpen"
      @close="closeAppointmentModal"
      @appointment-created="onAppointmentCreated"
    />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { usePatientsStore } from "@stores/patientsStore";

import TodayPatients from "@components/dashboardComponents/TodayPatients.vue";
import AppointmentModal from "@components/dashboardComponents/AppointmentModal.vue";

// Stores
const patientStore = usePatientsStore();

// Estado del modal
const isAppointmentModalOpen = ref(false);

/**
 * Abre el modal de agendamiento
 */
function openAppointmentModal() {
  isAppointmentModalOpen.value = true;
}

/**
 * Cierra el modal de agendamiento
 */
function closeAppointmentModal() {
  isAppointmentModalOpen.value = false;
}

/**
 * Maneja cuando se crea una nueva cita
 */
function onAppointmentCreated() {
  closeAppointmentModal();
  // Recargar las citas del día
  patientStore.fetchAppointments();
}

// Cargar citas al montar el componente
patientStore.fetchAppointments();

const todayFormatted = computed(() =>
  new Date().toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);
</script>
