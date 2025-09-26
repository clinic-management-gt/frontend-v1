<template>
  <div class="flex justify-between items-center mx-6 my-4">
    <div class="flex flex-col">
      <h1 class="text-3xl font-bold">
        {{ data.name }}
      </h1>
      <h1 class="text-3xl font-bold">
        {{ data.lastName }}
      </h1>
    </div>
    <div class="flex flex-col">
      <p>{{ $t("general.age") }}: {{ ageNumber }}</p>
      <p>{{ $t("general.sex") }}: {{ $t(gender) }}</p>
      <p>{{ $t("patients.blood-type") }}: {{ data.bloodType}}</p>
      <div>{{ $t("general.status") }}: <span :class="[statusColors[data.patientTypeId]]">{{ data.patientType }}</span></div>
    </div>
    <div class="flex justify-between">
      <action-button-solid-icon
        icon="ChartBarSquareIcon"
        size="h-16 w-16"
        color="text-patient-page-color"
        @click="props.chartAction && props.chartAction()"
      />
    </div>
  </div>
</template>
<script setup>
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


const statusColors = {
  1: 'inline-flex items-center rounded-full bg-gray-400/10 px-1.5 py-0.5 text-sm font-medium text-gray-400 inset-ring inset-ring-gray-400/20',
  2: 'inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-sm font-medium text-yellow-500 inset-ring inset-ring-yellow-400/20',
  3: 'inline-flex items-center rounded-full bg-red-900/20 px-1.5 py-0.5 text-sm font-medium text-red-400 inset-ring inset-ring-red-400/20',
  4: 'inline-flex items-center rounded-full bg-green-900/20 px-1.5 py-0.5 text-sm font-medium text-green-400 inset-ring inset-ring-green-500/20',
  5: 'inline-flex items-center rounded-full bg-blue-900/20 px-1.5 py-0.5 text-sm font-medium text-blue-400 inset-ring inset-ring-blue-400/30',
  6: 'inline-flex items-center rounded-full bg-purple-900/20 px-1.5 py-0.5 text-sm font-medium text-purple-400 inset-ring inset-ring-purple-400/30',
  7: 'inline-flex items-center rounded-full bg-indigo-900/20 px-1.5 py-0.5 text-sm font-medium text-indigo-400 inset-ring inset-ring-indigo-400/30',
  8: 'inline-flex items-center rounded-full bg-pink-900/20 px-1.5 py-0.5 text-sm font-medium text-pink-400 inset-ring inset-ring-pink-400/20',
}

</script>
