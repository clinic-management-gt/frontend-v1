<template>
     <div class="flex mx-7 my-4 justify-between items-center">
          <h1 class="text-2xl">{{ $t('patients.data-sheet') }}</h1>
          <action-button-solid-icon @click="props.viewDataSheet && props.viewDataSheet()" icon="EyeIcon"
               size="h-10 w-10" color="text-patient-page-color" />
     </div>
</template>
<script setup>
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue';
const props = defineProps({
     viewDataSheet: {
          type: Function,
          default: null
     }
})

</script>
