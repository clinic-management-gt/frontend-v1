<template>
  <general-dialog-modal
    ref="createDialog"
    :isOpen="isOpen"
    dialogSize="max-w-6xl"
    @close-modal="handleClose"
  >
    <template #title>
      <div class="flex justify-between items-center px-6 py-2 border-b">
        <p class="text-xl">{{ $t("patients.fill-out-form") }}</p>
      </div>
    </template>

    <template #body>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <!-- Input para subir PDF -->
          <drag-drop-file-input
            title="patients.drag-or-click-here-to-load-the-PDF-of-the-data-sheet"
            @send-files="handleSendFiles"
          />
          <!-- Vista previa -->
          <general-i-frame
            v-if="rawFile"
            :source="rawFile"
            height="700px"
          />
        </div>

        <div class="ml-2 sm:border-l">
          <create-new-patients-form v-if="currentPage === 1" />
          <review-patient-data v-if="currentPage === 2" />
          <spinning-arrow-loading v-if="currentPage === 3"/>
        </div>
      </div>
    </template>

    <template #buttons>
      <primary-button
        v-if="currentPage === 2"
        type="button"
        bgColor="orange"
        class="mr-2"
        @click="backPage()"
      >
        <div class="uppercase">{{ $t("general.back") }}</div>
      </primary-button>

      <primary-button type="button" class="mr-2" >
        <div v-if="currentPage === 1" @click="nextPage()" class="uppercase">{{ $t('general.next') }}</div>
        <div v-if="currentPage === 2" @click="createPatient()" class="uppercase">{{ $t("general.accept") }}</div>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { usePatientsStore } from "@stores/patientsStore.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import CreateNewPatientsForm from "@components/patientsDialogsComponents/patientsCreateDialogComponents/CreateNewPatientsForm.vue";
import ReviewPatientData from "@components/patientsDialogsComponents/patientsCreateDialogComponents/ReviewPatientData.vue";
import DragDropFileInput from "@components/forms/DragDropFileInput.vue";
import SpinningArrowLoading from "@components/forms/SpinningArrowLoading.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import GeneralIFrame from "@components/forms/GeneralIFrame.vue";

const patientsStore = usePatientsStore();
const { newPatientData } = storeToRefs(patientsStore);
const { createNewPatient } = patientsStore;
const patientsLogicStore = usePatientsLogicStore();
const { showCreateFormDialog } = storeToRefs(patientsLogicStore);

const currentPage = ref(1);
const rawFile = ref(newPatientData.value.file ?? null);

defineProps({
  isOpen: { type: Boolean, default: false },
});

const handleClose = (closeModal) => {
  showCreateFormDialog.value = closeModal;
  currentPage.value = 1;
};

async function handleSendFiles(fileReceived) {
  rawFile.value = fileReceived;
  console.log(fileReceived);

  if (fileReceived) {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64String = reader.result; // Obtienes el base64 del archivo
      console.log(base64String); // Base64 del archivo

      // Asigna el base64 al objeto `newPatientData.value`
      Object.assign(newPatientData.value, { InfoSheetFile: base64String });
    };
    
    // Lee el archivo como una URL base64
    reader.readAsDataURL(fileReceived);  // Usa readAsDataURL para obtener base64
  } else {
    newPatientData.value.InfoSheetFile = null;
  }
}

function nextPage() { currentPage.value += 1; }
function backPage() { currentPage.value -= 1; }

async function createPatient() {
  await createNewPatient(newPatientData.value);
  handleClose(false);
}
</script>
