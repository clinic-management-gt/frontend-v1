<template>
  <div class="flex flex-col my-4 mx-6">
    <div class="mb-2">
      <p class="text-md font-semibold text-gray-500">
        {{ $t("patients.last-visit") }}
      </p>
      <p class="text-xl font-medium">
        {{ lastVisit?.longSpanishDate || $t("general.nodata") }}
      </p>
    </div>
    <div class="mb-2">
      <p class="text-md font-semibold text-gray-500">
        {{ $t("patients.birthdate") }}
      </p>
      <p class="text-xl font-medium">
        {{ birthdate?.longSpanishDate || $t("general.nodata") }}
      </p>
    </div>
    <div v-if="Object.keys(alergiesList).length > 0" class="mb-2">
      <p class="text-md font-semibold text-gray-500">
        {{ $t("general.alergies") }}
      </p>
      <p 
        v-for="(item, index) in alergiesList"
        :key="index"
        class="text-xl font-medium"
      >
        {{ item.alergyCode }} - {{ item.alergyDescription }}
      </p>
    </div>
    <div v-if="Object.keys(chronicDiseases).length > 0">
      <p class="text-md font-semibold text-gray-600">
        {{ $t("patients.disease") }}
      </p>
      <p
        v-for="(item, index) in chronicDiseases"
        :key="index"
        class="text-xl font-medium"
      >
        {{ item.diseaseCode }} - {{ item.description }}
      </p>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { isoFormatDate } from "@utils/isoFormatDate";
const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => ({}),
  },
});
const lastVisit = isoFormatDate(props.data.lastVisit);
const birthdate = isoFormatDate(props.data.birthdate);
const alergiesList = computed(() => {
  return props.data.alergies || [];
});
const chronicDiseases = computed(() => {
  return props.data.patientChronicDiseases || [];
});

</script>
