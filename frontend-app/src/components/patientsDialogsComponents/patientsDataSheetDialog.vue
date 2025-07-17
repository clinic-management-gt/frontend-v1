<template>
     <general-dialog-modal ref="createDialog" @close-modal="handleClose" :isOpen="isOpen"
          :dialogClass="' rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'">
          <template #title>   
               Si
          </template>
          <template #body>
               body
          </template>
          <template #buttons>
       ai
          </template>
     </general-dialog-modal>
</template>
<script setup>
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import { DialogTitle } from '@headlessui/vue'
import { useForm } from 'vee-validate'
import { ref, defineAsyncComponent, computed } from 'vue'
import { storeToRefs } from "pinia"

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue"


const patientsLogicStore = usePatientsLogicStore()
const { showDataSheetPatientDialog } = storeToRefs(patientsLogicStore)

const handleClose = (closeModal) => {
     showDataSheetPatientDialog.value = closeModal
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
</script>