<template>
     <h1 class="text-xl font-bold text-back mb-8">Agendados</h1>
     <div v-if="isLoadingAppointments" class="text-center py-6">
          <basic-spinner-loading color="#489FB5" class="mx-auto" />
     </div>
     <div v-else>
          <div v-for="appointment in todaysAppointments" :key="appointment.date"
               class="flex items-stretch h-32 rounded-xl overflow-hidden mb-4">

               <div class="flex items-center bg-gray-200 rounded-xl w-3/4 p-4 flex-1">
                    <div class="flex-1">
                         <h2 class="text-3xl font-bold text-gray-800">{{ appointment.patientName }}</h2>
                         <p class="text-gray-600">
                              <span class="font-semibold">Médico:</span> {{ appointment.doctorName }}
                         </p>
                         <p class="text-gray-500 text-sm">
                              <span class="font-semibold">Fecha y Hora:</span>
                              {{ formatDateTime(appointment.date) }}
                         </p>
                    </div>
               </div>
               <div
                    :class="['flex items-center justify-center h-full w-1/4 ml-4 rounded-xl text-white font-bold text-xl', statusClass(appointment.status)]">
                    {{ appointment.status }}
               </div>
          </div>
     </div>
</template>
<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePatientsStore } from '../../stores/patientsStore';

import BasicSpinnerLoading from '../forms/BasicSpinnerLoading.vue';

const patientsStore = usePatientsStore()
const { appointments, isLoadingAppointments } = storeToRefs(patientsStore)

const todaysAppointments = computed(() => {
     const today = new Date();
     return appointments.value.filter((app) => {
          const appDate = new Date(app.date);
          return (
               appDate.getDate() === today.getDate() &&
               appDate.getMonth() === today.getMonth() &&
               appDate.getFullYear() === today.getFullYear()
          );
     });
});

function statusClass(status) {
     switch (status.toLowerCase()) {
          case "completado":
               return "bg-[#48C9B0]";
          case "confirmado":
               return "bg-blue-500";
          case "pendiente":
               return "bg-[#F4A261] text-yellow-900";
          case "cancelado":
               return "bg-red-500";
          case "espera":
               return "bg-[#F39C12]"
          case "consulta":
               return "bg[#5DADE2]"
          default:
               return "bg-gray-400";
     }
}

function formatDateTime(dateString) {
     const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
     };
     return new Date(dateString).toLocaleString("es-GT", options);
}
</script>