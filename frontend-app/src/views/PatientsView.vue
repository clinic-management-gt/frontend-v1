<template>
     <div>
          <div v-if="isLoadingPatientData" class="text-center py-6">
               {{ $t('patients.loading-patients-data') }}
          </div>
          <div v-else class="px-6 py-8 mx-auto grid grid-cols-5 grid-rows-5 gap-5">
               <panel class="col-span-5">
                    <PatientMainDataBox :data="currentPatientSelectedData" />
               </panel>
               <panel class="col-span-2 row-span-2 row-start-2">
                    <patient-important-information-box :data="currentPatientSelectedData" />
               </panel>
               <panel class="col-span-2 row-span-2 col-start-1 row-start-4">
                    <patient-contact-data-box :data="currentPatientSelectedData" />
               </panel>
               <panel class="col-span-3 col-start-3 row-start-2">
                    <patient-data-sheet-box :viewDataSheet="openDataSheetPatientDialog"/>
               </panel>
               <div class="col-span-3 row-span-3 col-start-3 row-start-3">
                    <patient-history-log-box :data="currentPatientMedicalRecords" />
               </div>
          </div>
     </div>
     <patients-data-sheet-dialog v-if="showDataSheetPatientDialog" @close="closeAllPatientDialog"
          :isOpen="showDataSheetPatientDialog" />
</template>

<script setup>
import { usePatientsStore } from "@stores/patientsStore";
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import { ref, watch, computed, onMounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from "pinia";
import { isoFormatDate } from '@/utils/isoFormatDate';
import { formatAgeFromDate } from '@/utils/formatAge';
import { normalizeGender } from '@/utils/normalizeGender';

import PatientContactDataBox from "@components/patientsComponents/PatientContactDataBox.vue"
import PatientDataSheetBox from "@components/patientsComponents/PatientDataSheetBox.vue"
import PatientHistoryLogBox from "@components/patientsComponents/PatientHistoryLogBox.vue"
import PatientImportantInformationBox from "@components/patientsComponents/PatientImportantInformationBox.vue"
import PatientMainDataBox from "@components/patientsComponents/PatientMainDataBox.vue"

import PatientsDataSheetDialog from '@components/patientsDialogsComponents/patientsDataSheetDialog.vue';
import Panel from "@components/forms/Panel.vue"

const patientsStore = usePatientsStore();
const {
     currentPatientSelectedId,
     currentPatientSelectedData,
     currentPatientMedicalRecords,
     isLoadingPatientData
} = storeToRefs(patientsStore);

const patientsLogicStore = usePatientsLogicStore()
const { 
     showDataSheetPatientDialog 
} = storeToRefs(patientsLogicStore)
const { openDataSheetPatientDialog, closeAllPatientDialog } = patientsLogicStore


// Observador para cargar datos cuando cambie el ID
watch(currentPatientSelectedId, async (newId) => {
     if (newId) {
          try {
               // Primero intentamos cargar datos básicos del paciente
               await patientsStore.fetchPatientData(newId);

               // Luego intentamos cargar registros médicos, pero manejamos el error
               try {
                    await patientsStore.fetchPatientMedicalRecords(newId);
               } catch (medicalError) {
                    console.warn('No se pudieron cargar registros médicos:', medicalError);
                    // No hacemos fallar toda la operación por esto
               }

          } catch (error) {
               console.error('Error al cargar datos del paciente:', error);
          }
     }
});

// Cargar datos del paciente seleccionado al montar el componente
onMounted(async () => {
     // Si ya hay un ID seleccionado, cargar sus datos
     if (currentPatientSelectedId.value) {
          try {
               // Cargar datos básicos del paciente
               await patientsStore.fetchPatientData(currentPatientSelectedId.value);

               // Intentar cargar registros médicos
               try {
                    await patientsStore.fetchPatientMedicalRecords(currentPatientSelectedId.value);
               } catch (medicalError) {
                    console.warn('No se pudieron cargar registros médicos:', medicalError);
               }
          } catch (error) {
               console.error('Error al cargar datos del paciente:', error);
          }
     }
});
</script>