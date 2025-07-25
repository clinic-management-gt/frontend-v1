<template>
  <div class="bg-gray-50 ">
    <RouterView />
    <patients-create-form-dialog v-if="showCreateFormDialog" @close="closeAllPatientDialog"
    :isOpen="showCreateFormDialog" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePatientsLogicStore } from '@stores/patientsLogicStore'
import patientsCreateFormDialog from '@components/patientsDialogsComponents/PatientsCreateFormDialog.vue'

const patientsLogicStore = usePatientsLogicStore()
const { closeAllPatientDialog } = patientsLogicStore
const { showCreateFormDialog } = storeToRefs(patientsLogicStore)

// const pacientes = ref([])
// onMounted(async () => {
//   try {
//     const res = await fetch(import.meta.env.VITE_API_URL + '/pacientes')
//     pacientes.value = await res.json()
//   } catch (error) {
//     console.error('Error al conectar con el backend:', error)
//   }
// })
</script>
