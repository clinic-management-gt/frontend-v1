<template>
  <general-table
    :data="tableData"
    :isLoadingContent="isLoadingPatientData"
    :defaultSort="currentSort"
    @update:sort="(newSort) => currentSort = newSort"
  />
</template>

<script setup>
import { usePatientsStore } from "@stores/patientsStore";
import { usePatientsLogicStore } from '@stores/patientsLogicStore';
import { computed, ref } from 'vue';
import { formatAgeFromDate } from '@utils/formatAge.js';
import { formatDateLong } from '@utils/isoFormatDate.js';
import { storeToRefs } from "pinia";

import GeneralTable from '@components/forms/GeneralTable.vue';

const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => []
  },
});

const patientsLogicStore = usePatientsLogicStore();
const { selectPatientById } = patientsLogicStore;
const patientsStore = usePatientsStore();
const { isLoadingPatientData } = storeToRefs(patientsStore);

const currentSort = ref({ key: 'name', direction: 'asc' });

const patientsHeader = computed(() => ({
  headers: [
    { 
      key: 'name', 
      label: 'general.first-name', 
      current: false, 
      visible: true, 
      sortable: true, 
      sortType: 'string', 
      hasAction: false, 
      valueKey: 'name' 
    },
    { 
      key: 'age', 
      label: 'general.age', 
      current: false, 
      visible: true, 
      sortable: true, 
      sortType: 'number', 
      hasAction: false, 
      valueKey: 'age' 
    },
    { 
      key: 'contacts',
      label: 'patients.contacts',
      current: false, 
      visible: true, 
      sortable: false,
      sortType: 'string', 
      hasAction: false, 
      valueKey: 'contacts'
    },
    { 
      key: 'lastVisit', 
      label: 'patients.last-visit', 
      current: false, 
      visible: true, 
      sortable: true, 
      sortType: 'date', 
      hasAction: false, 
      valueKey: 'lastVisit' 
    }
  ],
  noDataMessage: 'patients.empty-data',
  iconType: 'solidIcon',
}));

const formatContactsArray = (contact) => {
  if (!contact || (Array.isArray(contact) && contact.length === 0)) return ['-'];
  
  if (Array.isArray(contact)) {
    return contact.map(c => {
      const name = c.name || '';
      const lastName = c.lastName || '';
      const relationship = c.relationship || '';
      return `${name} ${lastName} - ${relationship}`.trim();
    });
  }
  
  const name = contact.name || '';
  const lastName = contact.lastName || '';
  const relationship = contact.relationship || '';
  return [`${name} ${lastName} - ${relationship}`.trim()];
};

const tableData = computed(() => ({
  ...patientsHeader.value,
  displayData: props.data.map(patient => ({
    id: patient.id,
    name: [{ 
      name: `${patient.name} ${patient.lastName}`, 
      style: 'px-3 py-4 text-sm text-start text-gray-700' 
    }],
    age: [{ 
      age: formatAgeFromDate(patient.birthdate, 'number'), 
      hasLabel: true, 
      label: formatAgeFromDate(patient.birthdate, 'number'), 
      style: 'px-3 py-4 text-sm text-center text-gray-700' 
    }],
    contacts: [{ 
      contacts: formatContactsArray(patient.contact || patient.contacts || patient.parents).join('\n'),
      isMultiLine: true 
    }],
    lastVisit: [{ 
      lastVisit: patient.lastVisit, 
      hasLabel: true, 
      label: formatDateLong(patient.lastVisit), 
      style: 'px-3 py-4 text-sm text-start text-gray-700' 
    }],
    action: () => selectPatientById(patient.id),
  }))
}));
</script>
