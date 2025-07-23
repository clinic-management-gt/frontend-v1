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
                         <drag-drop-file-input @sendFiles="handleSendFiles" :data="currentIndex"
                              title="patients.drag-or-click-here-to-load-the-PDF-of-the-data-sheet" />

                    </div>
                    <div>
                         <create-new-patients-form />
                    </div>
               </div>
          </template>
          <template #buttons>
               <primary-button type="button" @click="back()" class="mr-2">
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
import CreateNewPatientsForm from '@components/patientsDialogsComponents/patientsForms/CreateNewPatientsForm.vue'
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

const patientData = computed(() => currentPatientSelectedData.value)

const patientInfo = computed(() => [
     { label: 'general.first-name', value: patientData.value?.name ?? '' },
     { label: 'general.last-name', value: patientData.value?.lastName ?? '' },
     { label: 'general.birthdate', value: patientData.value?.birthdate ?? '' },
     { label: 'general.insurance', value: patientData.value?.insurance ?? '' },
     { label: 'general.family-pediatrician', value: patientData.value?.familyPediatrician ?? '' },
     { label: 'general.sex', value: patientData.value?.gender ?? '' }
])

const showDialog = computed({
     get: () => patientsLogicStore.showDataSheetPatientDialog,
     set: (val) => {
          patientsLogicStore.showDataSheetPatientDialog = val
     }
})

function handleSendFiles(file) {
     console.log(file)
}
</script>