<template>
  <div class="flex-1 flex  mx-7 my-4 justify-between items-center">
    <h1 class="text-2xl">
      {{ $t("patients.data-sheet") }}
    </h1>
    <action-button-outlined-icon
      icon="EyeIcon"
      size="h-10 w-10"
      color="text-patient-page-color"
      @click="props.viewDataSheet && props.viewDataSheet()"
    />
  </div>
</template>
<script setup>
import ActionButtonOutlinedIcon from "@components/forms/ActionButtonOutlinedIcon.vue";
const props = defineProps({
  viewDataSheet: {
    type: Function,
    default: null,
  },
});
</script>
