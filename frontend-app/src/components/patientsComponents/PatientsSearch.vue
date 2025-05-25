<template>
     <div class="flex flex-wrap items-center justify-center gap-4">
          <div class="w-72">
               <combo-box-autocomplete-input :data="allPatients" v-model:currentSelected="currentPatientSelectedId"/>
          </div>
          <div class="w-72 h-8">
               <primary-button>
                    <span class="flex uppercase items-center"> Agregar nuevo paciente </span>
               </primary-button>
          </div>
     </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { usePatientsStore } from '../../stores/patientsStore';

import ComboBoxAutocompleteInput from '../forms/ComboBoxAutocompleteInput.vue';
import PrimaryButton from '../forms/PrimaryButton.vue'

const patientsStore = usePatientsStore()

const { allPatients, currentPatientSelectedId } = storeToRefs(patientsStore)

watch(() => {
     console.log(currentPatientSelectedId)
})

</script>