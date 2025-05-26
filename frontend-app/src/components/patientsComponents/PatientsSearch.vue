<template>
     <!-- Componente de búsqueda de pacientes con autocompletado.
          Este componente solo muestra el box de búsqueda, sin botón de agregar. -->
     <div class="w-full flex items-center justify-center">
          <div class="w-full max-w-xl">
               <!-- Se utiliza el componente de autocompletado, recibiendo la lista de pacientes y el id seleccionado -->
               <combo-box-autocomplete-input
                    :data="allPatients"
                    v-model:currentSelected="currentPatientSelectedId"
               />
          </div>
     </div>
</template>

<script setup>
// Este componente conecta el store de pacientes con el componente de autocompletado.
// Solo sirve como wrapper para facilitar la reutilización y mantener el código limpio.

import { storeToRefs } from 'pinia';
import { usePatientsStore } from '../../stores/patientsStore';
import ComboBoxAutocompleteInput from '../forms/ComboBoxAutocompleteInput.vue';

// Se obtiene el store de pacientes y sus referencias reactivas
const patientsStore = usePatientsStore()
const { allPatients, currentPatientSelectedId } = storeToRefs(patientsStore)
</script>