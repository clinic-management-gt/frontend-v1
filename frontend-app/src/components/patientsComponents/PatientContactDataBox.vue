<template>
     <div class="flex justify-between items-center mx-4 my-4">
          <div class="flex flex-col">
               <span v-for="(item, index) in data" :key="index" class="flex my-2">
                    <action-button-solid-icon icon="PhoneIcon" size="h-10 w-10" color="text-patient-page-color" />
                    <div>
                         <h2 class="text-xl">{{ item.parent }}</h2>
                         <h3 class="text-md">{{ item.phone }}</h3>
                    </div>
               </span>
               <span v-for="(item, index) in gmailList" :key="index" class="flex my-2 items-center">
                    <action-button-solid-icon icon="EnvelopeIcon" size="h-10 w-10" color="text-patient-page-color" />
                    <div>
                         <h2>{{ item }}</h2>
                    </div>
               </span>
          </div>
     </div>
</template>
<script setup>
import { computed } from 'vue';
import { formatAgeFromDate } from '@utils/formatAge';
import { normalizeGender } from '@utils/normalizeGender';

import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue';

const props = defineProps({
     data: {
          type: [Array, Object],
          default: () => ({})
     },
})
const gmailList = computed(() => {
     const allEmails = Object.values(props.data).map(c => c.gmail)
     const filteredEmails = allEmails.filter(email => email != null)
     const uniqueEmails = [...new Set(filteredEmails)]
     return uniqueEmails
})


</script>