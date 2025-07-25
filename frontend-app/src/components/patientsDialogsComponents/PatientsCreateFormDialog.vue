<template>
     <general-dialog-modal ref="createDialog" @close-modal="handleClose" :isOpen="isOpen" dialogSize="max-w-6xl">
          <template #title>
               <p class="text-xl">
                    {{ $t('patients.fill-out-form') }}
               </p>
          </template>
          <template #body>
               <div class="grid grid-cols-2">
                    <div>
                         <drag-drop-file-input @sendFiles="handleSendFiles"
                              title="patients.drag-or-click-here-to-load-the-PDF-of-the-data-sheet" />

                    </div>
                    <div class="ml-2 sm:border-l">
                         <create-new-patients-form v-if="currentPage === 1"/>
                        <review-patient-data v-if="currentPage === 2"/>
                    </div>
               </div>
          </template>
          <template #buttons>
               <primary-button type="button" @click="backPage()" bgColor="orange" class="mr-2">
                    <div class="uppercase">{{ $t('general.back') }}</div>
               </primary-button>
               <primary-button type="button" @click="nextPage()" class="mr-2">
                    <div class="uppercase">{{ $t('general.accept') }}</div>
               </primary-button>
          </template>
     </general-dialog-modal>
</template>
<script setup>
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import { usePatientsStore } from "@stores/patientsStore.js"
import { DialogTitle } from '@headlessui/vue'
import { useForm } from 'vee-validate'
import { ref, defineAsyncComponent, computed } from 'vue'
import { storeToRefs } from "pinia"

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue"
import CreateNewPatientsForm from '@components/patientsDialogsComponents/patientsCreateDialogComponents/CreateNewPatientsForm.vue'
import ReviewPatientData from '@components/patientsDialogsComponents/patientsCreateDialogComponents/ReviewPatientData.vue'
import DragDropFileInput from '@components/forms/DragDropFileInput.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import Panel from "@components/forms/Panel.vue"

const patientsStore = usePatientsStore()
const { currentPatientSelectedData } = storeToRefs(patientsStore)

const patientsLogicStore = usePatientsLogicStore()
const { showCreateFormDialog } = storeToRefs(patientsLogicStore)

const handleClose = (closeModal) => {
     showCreateFormDialog.value = closeModal
}

const props = defineProps({
     contractCategoryId: {
          type: Number || null,
          default: null
     },
     id: {
          type: Number || null,
          default: null
     },
     isOpen: {
          type: Boolean,
          default: false
     },
})
const currentPage = ref(1)
const patientData = computed(() => currentPatientSelectedData.value)


const showDialog = computed({
     get: () => patientsLogicStore.showDataSheetPatientDialog,
     set: (val) => {
          patientsLogicStore.showDataSheetPatientDialog = val
     }
})

function handleSendFiles(file) {
     console.log(file)
}
function nextPage() {
  currentPage.value += 1
}
function backPage() {
  currentPage.value -= 1
}
</script>
