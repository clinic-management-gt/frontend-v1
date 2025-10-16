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
      key: 'contacts', // ✅ Cambié "parents" a "contacts"
      label: 'patients.contacts', // ✅ Cambié label
      current: false, 
      visible: true, 
      sortable: false, // ✅ Desactivar sort cuando hay múltiples líneas
      sortType: 'string', 
      hasAction: false, 
      valueKey: 'contacts', // ✅ Cambié valueKey
      isHtml: true // ✅ Agregar flag para HTML
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

const formatContactsHTML = (contact) => {
     console.log(contact);
  if (!contact || contact.length === 0) return '-';
  
  if (Array.isArray(contact)) {
    return contact
      .map(c => `<div class="text-gray-700">${c.name || ''} ${c.lastName || ''} - ${c.relationship || ''}</div>`)
      .join('');
  }
  
  return `<div class="text-gray-700">${contact.name || ''} ${contact.lastName || ''} - ${contact.relationship || ''}</div>`;
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
      contacts: formatContactsHTML(patient.contact || patient.contacts || patient.parents),
      isHtml: true
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
