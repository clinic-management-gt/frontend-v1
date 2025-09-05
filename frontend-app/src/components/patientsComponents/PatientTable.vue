<template>
     <general-table :data="tableData" :is-loading-content="isLoadingPatientData"
          :default-sort="currentSort" @update:sort="(newSort) => currentSort = newSort" />
</template>
<script setup>
import { usePatientsStore } from "@stores/patientsStore";
import { usePatientsLogicStore } from '@stores/patientsLogicStore'
import { computed, ref } from 'vue'
import { useI18n } from "vue-i18n";
import { formatAgeFromDate } from '@utils/formatAge.js'
import { formatDateShort } from '@utils/isoFormatDate.js'
import { storeToRefs } from "pinia";

import GeneralTable from '@components/forms/GeneralTable.vue'

const { t } = useI18n();
const props = defineProps({
     data: {
          type: [Array, Object],
          default: () => []
     },
})

const patientsLogicStore = usePatientsLogicStore()
const { openCreateFormDialog } = patientsLogicStore
const patientsStore = usePatientsStore();
const { isLoadingPatientData } = storeToRefs(patientsStore);

const currentSort = ref({ key: 'date', direction: 'asc' })
const patientsHeader = computed(() => ({
     headers: [
          { key: 'name', label: 'general.first-name', current: false, visible: true, sortable: true, sortType: 'date', hasAction: false, valueKey: 'name' },
          { key: 'age', label: 'general.age', current: false, visible: true, sortable: true, sortType: 'number', hasAction: false, valueKey: 'age' },
          { key: 'sex', label: 'general.sex', current: false, visible: true, sortable: true, sortType: 'string', hasAction: false, valueKey: 'sex' },
          { key: 'parents', label: 'patients.parents', current: false, visible: true, sortable: true, sortType: 'string', hasAction: false, valueKey: 'parents' },
          { key: 'lastVisit', label: 'patients.last-visit', current: false, visible: true, sortable: true, sortType: 'date', hasAction: false, valueKey: 'lastVisit' },
          { key: 'actions', label: 'general.actions', current: false, visible: true, sortable: false, hasAction: true, buttonType: 'solidIcon', action: () => openCreateFormDialog(), iconType: 'PlusCircleIcon', color: 'emerald', style: "h-8 w-8 ml-4 mt-4" }
     ],
     noDataMessage: 'patients.empty-data',
     iconType: 'solidIcon',
}))

const tableData = computed(() => ({
     ...patientsHeader.value,
     displayData: props.data.map(patient => ({
          id: patient.id,
          name: [{ name: `${patient.name} ${patient.lastName}`, style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          age: [{ age: formatAgeFromDate(patient.birthdate, 'string'), style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          sex: [{ sex: patient.gender == 'Male' ? t('general.male') : t('general.female'), style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          parents: [{ parents: patient.parents, style: 'px-3 py-4 text-sm text-start text-gray-700', }],
          lastVisit: [{ date: patient.date, hasLabel: true, label: formatDateShort(patient.date), style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          actions: [
               { type: 'ArrowTopRightOnSquareIcon', action: () => openViewDialog(category.id), color: "emerald", buttonType: 'solid' },
          ]
     }))
}))
</script>
