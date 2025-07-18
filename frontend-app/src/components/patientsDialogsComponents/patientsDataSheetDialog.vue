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
                         <!-- <panel> -->
                              <p class="font-bold">
                                   {{ $t('patients.patients-data') }}
                              </p>
                              <div class="grid grid-cols-2 gap-2 mt-2">
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.first-name') }}</p>
                                        <p>{{ firstName }}</p>
                                   </div>
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.last-name') }}</p>
                                        <p>{{ lastName }}</p>
                                   </div>
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.birthdate') }}</p>
                                        <p>{{ birthdate }}</p>
                                   </div>
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.insurance') }}</p>
                                        <p>{{ insurance }}</p>
                                   </div>
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.family-pediatrician') }}</p>
                                        <p>{{ familyPediatrician }}</p>
                                   </div>
                                   <div>
                                        <p class="font-thin text-gray-600">{{ $t('general.sex') }}</p>
                                        <p>{{ gender }}</p>
                                   </div>
                              </div>
                         <!-- </panel> -->
                    </div>
                    <!-- <div className="row-start-2">
                         <panel>
                              2
                         </panel>
                    </div>
                    <div className="row-start-2">
                         <panel>
                              3
                         </panel>
                    </div>
                    <div className="row-start-3">
                         <panel>
                              4
                         </panel>
                    </div>
                    <div className="row-start-3">
                         <panel>
                              5
                         </panel>
                    </div> -->
               </div>
          </template>
          <template #buttons>
               av
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
// Probando comentarios
// Mas prueba de comentarios
// Computed para acceder a los datos reactivamente
const patientData = computed(() => patientsStore.currentPatientSelectedData.value)

const firstName = computed(() => patientData.value?.name ?? '')
const lastName = computed(() => patientData.value?.lastName ?? '')
const insurance = computed(() => patientData.value?.insurance ?? '')
const gender = computed(() => patientData.value?.gender ?? '')
const familyPediatrician = computed(() => patientData.value?.familyPediatrician ?? '')
const birthdate = computed(() => patientData.value?.birthdate ?? '')

const showDialog = computed({
     get: () => patientsLogicStore.showDataSheetPatientDialog,
     set: (val) => {
          patientsLogicStore.showDataSheetPatientDialog = val
     }
})

</script>