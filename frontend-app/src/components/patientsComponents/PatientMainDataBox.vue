<template>
  <div class="flex justify-between items-center mx-6 my-4">
    <div class="flex flex-col">
      <h1 class="text-3xl font-bold">{{ data.name }}</h1>
      <h1 class="text-3xl font-bold">{{ data.lastName }}</h1>
    </div>
    <div class="flex flex-col">
      <p>{{ $t("general.age") }}: {{ ageNumber }}</p>
      <p>{{ $t("general.sex") }}: {{ $t(gender) }}</p>
      <p>{{ $t("general.alergies") }}: {{ $t(gender) }}</p>
    </div>
    <div class="flex justify-between">
      <action-button-solid-icon
        @click="props.createAction && props.createAction()"
        icon="PlusIcon"
        size="h-16 w-16"
        color="text-patient-page-color"
      />
      <action-button-solid-icon
        @click="props.chartAction && props.chartAction()"
        icon="ChartBarSquareIcon"
        size="h-16 w-16"
        color="text-patient-page-color"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { formatAgeFromDate } from "@utils/formatAge";
import { normalizeGender } from "@utils/normalizeGender";

import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";

const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => ({}),
  },
  createAction: {
    type: Function,
    default: null,
  },
  chartAction: {
    type: Function,
    default: null,
  },
});
const ageNumber = formatAgeFromDate(props.data.birthdate, "string");
const gender = normalizeGender(props.data.gender);
</script>
