<template>
     <div class="flex justify-between items-center mx-4 my-4">
          <div class="flex flex-col">
               <span v-for="(item, index) in contactList" :key="index" class="flex my-2">
                    <action-button-solid-icon icon="PhoneIcon" size="h-10 w-10" color="text-patient-page-color" />
                    <div>
                         <h2 class="text-xl">{{ item?.parent || $t('general.nodata') }}</h2>
                         <h3 class="text-md">{{ item?.phone || $t('general.nodata') }}</h3>
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
     const values = Array.isArray(props.data)
          ? props.data
          : Object.values(props.data)

     const allEmails = values
          .filter(c => c && typeof c === 'object' && c.gmail && typeof c.gmail === 'object')
          .flatMap(c => Object.values(c.gmail)) // accede a todos los correos del objeto gmail

     const filteredEmails = allEmails.filter(email => email != null && email !== '')
     const uniqueEmails = [...new Set(filteredEmails)]
     return uniqueEmails
})


const contactList = computed(() => {
     const values = Array.isArray(props.data)
          ? props.data
          : Object.values(props.data)

     const contacts = values
          .filter(c => c && typeof c === 'object' && c.contacts && typeof c.contacts === 'object')
          .flatMap(c => Object.values(c.contacts))

     const formattedContacts = contacts
          .filter(contact => contact.phone)
          .map(contact => ({
               parent: [contact.name, contact.lastname].filter(Boolean).join(' '),
               phone: contact.phone
          }))

     return formattedContacts
})





</script>