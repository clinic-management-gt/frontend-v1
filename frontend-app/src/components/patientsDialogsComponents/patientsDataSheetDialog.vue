<template>
     <general-dialog-modal ref="createDialog" @close-modal="handleClose" :isOpen="isOpen" dialogSize="max-w-6xl">
          <template #title>
               <p class="text-xl">
                    {{ $t('patients.data-sheet') }}
               </p>
          </template>
          <template #body>
               <div className="grid grid-cols-2 grid-rows-3 gap-4">
                    <div className="col-span-2">
                         <panel>
                              <p class="font-bold">
                                   {{ $t('patients.patients-data') }}
                              </p>
                              <div class="grid grid-cols-2 gap-2 mt-2">
                                   <div v-for="(item, index) in patientInfo" :key="index" class="flex">
                                        <p class="font-thin text-gray-600 mr-2">{{ $t(item.label) }}:</p>
                                        <p>{{ item.value }}</p>
                                   </div>
                              </div>
                         </panel>
                    </div>
                    <div class="row-start-2">
                         <panel>
                              <p class="font-bold">
                                   {{ $t('patients.record') }}
                              </p>
                         </panel>
                    </div>
                    <div class="row-start-2">
                         <panel>
                              <p class="font-bold">
                                   {{ $t('patients.current-illnesses') }}
                              </p>
                         </panel>
                    </div>
                    <div class="row-start-3">
                         <panel>
                              <p class="font-bold">
                                   {{ $t('patients.exams') }}
                              </p>
                         </panel>
                    </div>
                    <div class="row-start-3">
                         <panel>
                              <p class="font-bold">
                                   {{ $t('patients.laboratories') }}
                              </p>
                         </panel>
                    </div>
               </div>
          </template>
     </general-dialog-modal>
</template>
<script setup>
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import {usePatientsStore} from "@stores/patientsStore.js"
import { DialogTitle } from '@headlessui/vue'
import { useForm } from 'vee-validate'
import { ref, defineAsyncComponent, computed } from 'vue'
import { storeToRefs } from "pinia"

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue"
import Panel from "@components/forms/Panel.vue"

const patientsStore = usePatientsStore()
const { currentPatientSelectedData } = storeToRefs(patientsStore)

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

</script>