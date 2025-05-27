<template>
  <div>
    <h1 class="text-xl font-bold text-back mb-8">Agendados</h1>

    <div v-if="isLoadingAppointmentsToday" class="text-center py-6">
      <basic-spinner-loading color="#489FB5" class="mx-auto" />
    </div>

    <div v-else>
      <transition-group name="fade" tag="div">
        <div
          v-for="appointment in appointmentsToday"
          :key="appointment.id"
          class="flex items-stretch h-32 rounded-xl overflow-hidden mb-4"
        >
          <div class="flex items-center bg-gray-200 rounded-xl w-3/4 p-4 flex-1">
            <div class="flex-1">
              <h2 class="text-3xl font-bold text-gray-800">
                {{ appointment.patientName }}
              </h2>
              <p class="text-gray-600">
                <span class="font-semibold">Médico:</span>
                {{ appointment.doctorName }}
              </p>
              <p class="text-gray-500 text-sm">
                <span class="font-semibold">Fecha y Hora:</span>
                {{ formatDateTime(appointment.date) }}
              </p>
            </div>
          </div>

          <div
            :class="[
              'flex items-center justify-center h-full w-1/4 ml-4 rounded-xl text-white font-bold text-xl',
              statusClass(appointment.status)
            ]"
            @click="changueStatus(appointment)"
            style="cursor: pointer;"
          >
            {{ appointment.status }}
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style>
     .fade-enter-active,
     .fade-leave-active {
     transition: opacity 0.3s;
     }
     .fade-enter-from,
     .fade-leave-to {
     opacity: 0;
     }
</style>

<script setup>
     import { onMounted } from 'vue';
     import { storeToRefs } from 'pinia';
     import { usePatientsStore } from '../../stores/patientsStore';
     import BasicSpinnerLoading from '../forms/BasicSpinnerLoading.vue';

     const patientsStore = usePatientsStore()
     const { appointmentsToday, isLoadingAppointmentsToday } = storeToRefs(patientsStore)

     onMounted(() => {
          patientsStore.fetchAppointmentsToday();
     });

     // Solo los que realmente existen en el enum de tu DB
     const statusOrder = [
     "pendiente",
     "confirmado",
     "completado",
     "cancelado",
     "espera"
     ];

     const statusEnumMap = {
     pendiente:  'Pendiente',
     confirmado: 'Confirmado', 
     completado: 'Completado',
     cancelado:  'Cancelado',
     espera:     'Espera',
     };
     
     async function changueStatus(appointment) {
          const curr = appointment.status.toLowerCase();
          const next = statusOrder[(statusOrder.indexOf(curr) + 1) % statusOrder.length];
          const enumValue = statusEnumMap[next];

          appointment.status = next;

          const ok = await patientsStore.updateAppointmentStatus(appointment.id, enumValue);
          if (!ok) {
          appointment.status = curr;
          }
     }



     function statusClass(status) {
          switch (status?.toLowerCase()) {
          case "completado":
               return "bg-[#48C9B0]";
          case "confirmado":
               return "bg-blue-500";
          case "pendiente":
               return "bg-[#F4A261] text-yellow-900";
          case "cancelado":
               return "bg-red-500";
          case "espera":
               return "bg-[#F39C12]";
          case "consulta":
               return "bg-[#5DADE2]";
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