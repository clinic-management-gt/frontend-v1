<template>
  <div>
    <h1 class="text-xl font-bold text-back mb-8">
      Pacientes para hoy — {{ todayFormatted }}
    </h1>

    <div v-if="isLoadingAppointmentsToday" class="text-center py-6">
      <basic-spinner-loading color="#489FB5" class="mx-auto" />
    </div>

    <div v-else>
      <!-- ✅ v-if en wrapper, NO junto con v-for -->
      <div v-if="appointmentsToday.length > 0">
        <transition-group name="fade" tag="div">
          <div
            v-for="appointment in appointmentsToday"
            :key="appointment.id"
            class="flex items-stretch h-32 rounded-xl overflow-hidden my-4"
          >
            <!-- Info del paciente y cita -->
            <div class="mb-2 flex w-full">
              <div class="flex items-center bg-white shadow-md rounded-xl w-3/4 p-4 flex-1">
                <div class="flex-1">
                  <h2 
                    class="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                    :title="`Ver detalles de ${appointment.patientName}`"
                    @click="navigateToPatient(appointment)"
                  >
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

              <!-- Botón de estado -->
              <div
                :class="[
                  'flex items-center justify-center h-full w-1/4 ml-4 shadow-md rounded-xl text-white font-bold text-xl capitalize',
                  statusClass(appointment.status),
                ]"
                style="cursor: pointer"
                @click="changueStatus(appointment)"
              >
                {{ appointment.status }}
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Mensaje vacío -->
      <div v-else>
        {{ $t("dashboard.no-patients-for-today") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { usePatientsStore } from "../../stores/patientsStore";
import BasicSpinnerLoading from "../forms/BasicSpinnerLoading.vue";

const patientsStore = usePatientsStore();
const { appointmentsToday, isLoadingAppointmentsToday } = storeToRefs(patientsStore);
const router = useRouter();

onMounted(() => {
  patientsStore.fetchAppointmentsToday();
});

const todayFormatted = computed(() =>
  new Date().toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

const statuses = [
  { key: "pendiente",   label: "Pendiente",   class: "bg-[#F4A261] text-yellow-900" },
  { key: "confirmado",  label: "Confirmado",  class: "bg-blue-500" },
  { key: "completado",  label: "Completado",  class: "bg-[#48C9B0]" },
  { key: "cancelado",   label: "Cancelado",   class: "bg-red-500" },
  { key: "espera",      label: "Espera",      class: "bg-[#F39C12]" },
];

const statusMap = Object.fromEntries(statuses.map((s) => [s.key, s]));

async function changueStatus(appointment) {
  const currKey = appointment.status.toLowerCase();
  const idx = statuses.findIndex((s) => s.key === currKey);
  const next = statuses[(idx + 1) % statuses.length];

  appointment.status = next.key;

  const ok = await patientsStore.updateAppointmentStatus(appointment.id, next.label);
  if (!ok) appointment.status = currKey;
}

function statusClass(status) {
  const key = status?.toLowerCase();
  return statusMap[key]?.class || "bg-gray-400";
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("es-GT", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

/**
 * Navega al detalle del paciente seleccionado
 * @param {Object} appointment - Objeto de cita que contiene patientId
 */
function navigateToPatient(appointment) {
  if (appointment.patientId) {
    patientsStore.setPatientsData(appointment.patientId);
    router.push('/patients');
  }
}
</script>
