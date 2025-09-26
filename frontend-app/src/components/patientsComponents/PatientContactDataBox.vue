<template>
  <div class="flex flex-col my-4 mx-4">
    <div class="text-md font-semibold text-gray-500">
      {{ $t('patients.patients-contacts') }}
    </div>
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <span v-if="contactList.length == 0">
          {{ $t('general.nodata') }}
        </span>
        <span
          v-for="(item, index) in contactList"
          :key="index"
          class="flex my-2 items-center"
        >
          <action-button-solid-icon
            icon="PhoneIcon"
            size="h-12 w-12"
            color="text-patient-page-color"
          />
          <div>
            <h2 class="text-xl">{{ item.parent }}</h2>
            <h3 class="text-md">{{ item.phone }}</h3>
          </div>
        </span>
        <span
          v-for="(item, index) in gmailList"
          :key="index"
          class="flex my-2 items-center"
        >
          <action-button-solid-icon
            icon="EnvelopeIcon"
            size="h-10 w-10"
            color="text-patient-page-color"
          />
          <div>
            <h2>{{ item }}</h2>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";

const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => ({}),
  },
});
const gmailList = computed(() => {
  const values = Array.isArray(props.data)
    ? props.data
    : Object.values(props.data);

  const allEmails = values
    .filter(
      (c) =>
        c && typeof c === "object" && c.gmail && typeof c.gmail === "object",
    )
    .flatMap((c) => Object.values(c.gmail));

  const filteredEmails = allEmails.filter(
    (email) => email != null && email !== "",
  );
  const uniqueEmails = [...new Set(filteredEmails)];
  return uniqueEmails;
});

const contactList = computed(() => {
  const contacts = props.data?.contacts || [];

  const formattedContacts = contacts
    .filter((contact) => contact.phones && contact.phones.length > 0) 
    .map((contact) => ({
      parent: [contact.name, contact.lastName].filter(Boolean).join(" "),
      phone: contact.phones[0].replace(/^(\d{4})(\d{4})$/, '$1-$2'),
    }));

  return formattedContacts;
});
</script>
