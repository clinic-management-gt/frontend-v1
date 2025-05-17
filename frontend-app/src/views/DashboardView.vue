<template>
  <div class="px-6 py-8 max-w-4xl mx-auto">
    <today-patients />
  </div>
</template>
<script setup>
import { PatientsStore } from "../stores/patientsStore";

import TodayPatients from "../components/dashboardComponents/TodayPatients.vue";

const patientStore = PatientsStore()


patientStore.fetchAppointments()
</script>
