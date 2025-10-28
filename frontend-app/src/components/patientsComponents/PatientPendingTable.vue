<template>
  <general-table
    :data="tableData"
    :isLoadingContent="isLoadingPendingPatients"
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
import { useI18n } from "vue-i18n";

import GeneralTable from '@components/forms/GeneralTable.vue';

const props = defineProps({
  data: {
    type: [Array, Object],
    default: () => []
  },
});

const { t } = useI18n();
const patientsLogicStore = usePatientsLogicStore();
const { selectPatientById } = patientsLogicStore;
const patientsStore = usePatientsStore();
const { isLoadingPendingPatients } = storeToRefs(patientsStore);

const currentSort = ref({ key: 'name', direction: 'asc' });

const pendingPatientsHeader = computed(() => ({
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
      key: 'createdAt', 
      label: 'patients.created-at', 
      current: false, 
      visible: true, 
      sortable: true, 
      sortType: 'date', 
      hasAction: false, 
      valueKey: 'createdAt' 
    }
  ],
  noDataMessage: 'patients.no-pending-patients',
  iconType: 'solidIcon',
}));

const formatContactsArray = (contacts) => {
  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return ['-'];
  }

  // Formatear cada contacto: "Tipo - Teléfono(s)"
  return contacts.map(contact => {
    const type = contact.type || t('patients.contact');
    const phones = contact.phoneNumbers || [];

    if (phones.length > 0) {
      return `${type} - ${phones.join(', ')}`;
    }

    return type;
  });
};

const tableData = computed(() => ({
  ...pendingPatientsHeader.value,
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
      contacts: formatContactsArray(patient.contacts).join('\n'),
      isMultiLine: true
    }],
    createdAt: [{
      date: patient.createdAt,
      hasLabel: true,
      label: formatDateLong(patient.createdAt),
      style: 'px-3 py-4 text-sm text-start text-gray-700'
    }],
    action: () => selectPatientById(patient.id),
  }))
}));
</script>