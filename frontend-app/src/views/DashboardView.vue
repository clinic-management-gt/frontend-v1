<template>
  <div class="px-6 py-8 mx-auto">
    <today-patients />
  </div>
</template>
<script setup>
import { usePatientsStore } from "@stores/patientsStore";

const patientStore = usePatientsStore()

import TodayPatients from "@components/dashboardComponents/TodayPatients.vue";

//const patientStore = PatientsStore()


patientStore.fetchAppointments()
</script>
