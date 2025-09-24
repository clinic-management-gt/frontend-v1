<template>
  <general-dialog-modal
    ref="createDialog"
    :isOpen="isOpen"
    dialogSize="max-w-6xl"
    @close-modal="handleClose"
  >
    <template #title>
      <div class="flex justify-between items-center px-6 py-2 border-b">
        <div>
          <p class="text-xl">
            {{ $t("patients.fill-out-form") }}
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <div class="grid grid-cols-2">
        <div>
          <drag-drop-file-input
            title="patients.drag-or-click-here-to-load-the-PDF-of-the-data-sheet"
            @send-files="handleSendFiles"
          />
          <general-i-frame
            v-if="file"
            :source="file"
          />
        </div>
        <div class="ml-2 sm:border-l">
          <create-new-patients-form v-if="currentPage === 1" />
          <review-patient-data v-if="currentPage === 2" />
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
        <div class="uppercase">
          {{ $t("general.back") }}
        </div>
      </primary-button>
      <primary-button
        type="button"
        class="mr-2"
        @click="nextPage()"
      >
        <div class="uppercase">
          {{ $t("general.accept") }}
        </div>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>
<script setup>
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { usePatientsStore } from "@stores/patientsStore.js";
import { useBlobAdapter } from "@/composables/useBlobAdapter";
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import CreateNewPatientsForm from "@components/patientsDialogsComponents/patientsCreateDialogComponents/CreateNewPatientsForm.vue";
import ReviewPatientData from "@components/patientsDialogsComponents/patientsCreateDialogComponents/ReviewPatientData.vue";
import DragDropFileInput from "@components/forms/DragDropFileInput.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import GeneralIFrame from "@components/forms/GeneralIFrame.vue";

const patientsStore = usePatientsStore();
const { newPatientData } =
  storeToRefs(patientsStore);

const patientsLogicStore = usePatientsLogicStore();
const { showCreateFormDialog } = storeToRefs(patientsLogicStore);

const handleClose = (closeModal) => {
  showCreateFormDialog.value = closeModal;
};

const rawFile = ref(newPatientData.value.file ?? null);
const file = computed(() => blobUrl.value);
const { blobUrl, generate } = useBlobAdapter(rawFile, {
  mimeType: "application/pdf",
});
const currentPage = ref(1);

function handleSendFiles(fileReceived) {
  rawFile.value = fileReceived;
  patientsStore.uploadFile(
    fileReceived,
    "laboratorios",
    1,
    "descripcion de prueba",
    1,
  );
  if (fileReceived) {
    generate();
    newPatientData.value.file = fileReceived;
  } else {
    blobUrl.value && URL.revokeObjectURL(blobUrl.value);
    blobUrl.value = null;
    newPatientData.value.file = null;
  }
}

function nextPage() {
  currentPage.value += 1;
}
function backPage() {
  currentPage.value -= 1;
}
</script>
