<template>
  <div class="w-full flex items-center justify-center">
    <div class="w-full max-w-xl">
      <combo-box-autocomplete-input
        v-model:currentSelected="currentPatientSelectedId"
        :data="allPatients"
        :placeholder="$t('general.search-patient')"
        @update:current-selected="patientsStore.setPatientsData"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePatientsStore } from "@stores/patientsStore";
import ComboBoxAutocompleteInput from "@components/forms/ComboBoxAutocompleteInput.vue";

const patientsStore = usePatientsStore();
const { allPatients, currentPatientSelectedId } = storeToRefs(patientsStore);
</script>
