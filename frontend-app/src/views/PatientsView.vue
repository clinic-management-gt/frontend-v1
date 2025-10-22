<template>
  <div>
    <div
      v-if="isLoadingPatientData"
      class="text-center py-6"
    >
      {{ $t("patients.loading-patients-data") }}
    </div>
    <div
      v-else-if="currentPatientSelectedData == null"
      class="px-6 py-6 mx-auto space-y-6"
    >
      <!-- Tabla de Pacientes Activos -->
      <app-panel>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <p class="text-2xl mr-2">
              {{ $t('patients.patients') }}
            </p>
            <p class="text-md text-gray-500">
              ({{ Object.keys(allPatients).length }})
            </p>
          </div>
        </div>
        <patients-filter :data="allPatients" @filtered-data="handleFilters" />
        <patient-table :data="updatedFilteredPatients" />
      </app-panel>

      <!-- Tabla de Pacientes Pendientes -->
      <app-panel>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <p class="text-2xl mr-2">
              {{ $t('patients.pending-patients') }}
            </p>
            <p class="text-md text-gray-500">
              ({{ pendingPatients.length }})
            </p>
          </div>
          <primary-button
            :disabled="isLoadingPendingPatients"
            @click="refreshPendingPatients"
          >
            <span class="flex items-center">
              <ArrowPathIcon 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': isLoadingPendingPatients }"
              />
              {{ $t('general.refresh') }}
            </span>
          </primary-button>
        </div>
        <patient-pending-filter 
          :data="pendingPatients" 
          @filtered-data="handlePendingFilters" 
        />
        <patient-pending-table :data="updatedFilteredPendingPatients" />
      </app-panel>
    </div>
    <div
      v-else
      class="px-6 py-6 mx-auto"
    >
      <p class="flex items-center cursor-pointer text-gray-500 mb-2" @click="returnToPatientsTable()">
        <arrow-uturn-left-icon class="size-4 mr-2" />
        {{ $t('patients.return-to-patient-table') }}
      </p>
      <div class="grid grid-cols-5 grid-rows-5 gap-3">
        <app-panel class="col-span-5 flex-grow">
          <PatientMainDataBox :data="currentPatientSelectedData" />
        </app-panel>
        <app-panel class="col-span-2 row-span-2 row-start-2">
          <patient-important-information-box :data="currentPatientSelectedData" />
        </app-panel>
        <app-panel class="col-span-2 row-span-2 col-start-1 row-start-4">
          <patient-contact-data-box :data="currentPatientSelectedData" />
        </app-panel>
        <app-panel class="col-span-3 col-start-3 row-start-2 flex flex-1 items-center">
          <patient-data-sheet-box :viewDataSheet="openDataSheetPatientDialog" />
        </app-panel>
        <div class="col-span-3 row-span-3 col-start-3 row-start-3">
          <patient-history-log-box
            :patientId="currentPatientSelectedId"
            @view-recipe="openRecipeModal"
          />
        </div>
      </div>
    </div>
  </div>
  <patients-data-sheet-dialog
    v-if="showDataSheetPatientDialog"
    :isOpen="showDataSheetPatientDialog"
    @close="closeAllPatientDialog"
  />
</template>

<script setup>
import { usePatientsStore } from "@stores/patientsStore";
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { ArrowUturnLeftIcon } from "@heroicons/vue/20/solid";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

import PatientContactDataBox from "@components/patientsComponents/PatientContactDataBox.vue";
import PatientDataSheetBox from "@components/patientsComponents/PatientDataSheetBox.vue";
import PatientHistoryLogBox from "@components/patientsComponents/PatientHistoryLogBox.vue";
import PatientImportantInformationBox from "@components/patientsComponents/PatientImportantInformationBox.vue";
import PatientMainDataBox from "@components/patientsComponents/PatientMainDataBox.vue";
import PatientsDataSheetDialog from "@components/patientsDialogsComponents/patientsDataSheetDialog.vue";
import PatientTable from "@components/patientsComponents/PatientTable.vue";
import PatientPendingTable from "@components/patientsComponents/PatientPendingTable.vue";
import PatientsFilter from "@components/patientsComponents/PatientsFilter.vue";
import PatientPendingFilter from "@components/patientsComponents/PatientPendingFilter.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import AppPanel from "@components/forms/AppPanel.vue";

const showRecipeModal = ref(false);
const selectedRecipe = ref(null);

function openRecipeModal(receta) {
  selectedRecipe.value = receta;
  showRecipeModal.value = true;
}

const patientsStore = usePatientsStore();
const {
  currentPatientSelectedId,
  currentPatientSelectedData,
  isLoadingPatientData,
  allPatients,
  pendingPatients,
  isLoadingPendingPatients,
} = storeToRefs(patientsStore);

const { fetchPendingPatients } = patientsStore;

const patientsLogicStore = usePatientsLogicStore();
const { showDataSheetPatientDialog } = storeToRefs(patientsLogicStore);
const { openDataSheetPatientDialog, closeAllPatientDialog, returnToPatientsTable } = patientsLogicStore;

// Filtros para pacientes activos
const updatedFilteredPatients = ref([]);
const handleFilters = (filteredData) => {
  updatedFilteredPatients.value = filteredData;
};

// Filtros para pacientes pendientes
const updatedFilteredPendingPatients = ref([]);
const handlePendingFilters = (filteredData) => {
  updatedFilteredPendingPatients.value = filteredData;
};

onMounted(async () => {
  await patientsStore.fetchAllPatients();
});

watch(currentPatientSelectedId, async (newId) => {
  if (newId) {
    await patientsStore.fetchPatientData(newId);
    await patientsStore.fetchPatientMedicalRecords(newId);
  }
});

onMounted(async () => {
  await patientsStore.fetchAllPatients();
  await fetchPendingPatients();

  
  if (currentPatientSelectedId.value) {
    await patientsStore.fetchPatientData(currentPatientSelectedId.value);
    await patientsStore.fetchPatientMedicalRecords(currentPatientSelectedId.value);
  }
});
</script>
