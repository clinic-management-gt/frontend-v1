<template>
     <general-table :data="tableData" :is-loading-content="isLoadingFetchLawyerInstruments"
          :default-sort="currentSort" @update:sort="(newSort) => currentSort = newSort" />
</template>
<script setup>
import { computed, ref } from 'vue'
import { useI18n } from "vue-i18n";
import { isoFormatDate } from '@/utils/isoFormatDate';
import { storeToRefs } from 'pinia'
import { formatDateShort } from '@/utils/isoFormatDate.js'


import GeneralTable from '@components/forms/GeneralTable.vue'

const { t } = useI18n();
const props = defineProps({
     data: {
          type: [Array, Object],
          default: () => []
     },
})
const currentSort = ref({ key: 'date', direction: 'asc' })
const instrumentData = computed(() => ({
     headers: [
          { key: 'name', label: 'general.first-name', current: false, visible: true, sortable: true, sortType: 'date', hasAction: false, valueKey: 'name' },
          { key: 'age', label: 'general.age', current: false, visible: true, sortable: true, sortType: 'number', hasAction: false, valueKey: 'age' },
          { key: 'parents', label: 'patients.parents', current: false, visible: true, sortable: true, sortType: 'string', hasAction: false, valueKey: 'parents' },
          { key: 'lastVisit', label: 'patients.last-visit', current: false, visible: true, sortable: true, sortType: 'date', hasAction: false, valueKey: 'lastVisit' },
          { key: 'actions', label: 'general.actions', current: false, visible: true, sortable: false, hasAction: true, buttonType: 'solidIcon', action: () => openAddDialog(), iconType: 'PlusCircleIcon', color: 'emerald', style: "h-8 w-8 ml-4 mt-4" }
     ],
     noDataMessage: 'patients.empty-data',
     iconType: 'solidIcon',
}))

const tableData = computed(() => ({
     ...instrumentData.value,
     displayData: props.data.map(patient => ({
          id: patient.id,
          name: [{ name: patient.name, style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          age: [{ age: patient.number, style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          parents: [{ parents: patient.client, style: 'px-3 py-4 text-sm text-start text-gray-700', }],
          lastVisit: [{ date: patient.date, hasLabel: true, label: formatDateShort(patient.date), style: 'px-3 py-4 text-sm text-start text-gray-700' }],
          actions: [
               { type: 'EyeIcon', action: () => openViewDialog(category.id), color: "emerald", buttonType: 'solid' },
          ]
     }))
}))
const getProgressText = (value) => {
     if (value === 0) {
          return 'general.not-started'
     } else if (value < 100) {
          return 'general.incomplete'
     } else {
          return 'general.complete'
     }
}
const getProgressColor = (value) => {
     if (value === 0) {
          return 'text-red-500'
     } else if (value < 100) {
          return 'text-yellow-500'
     } else {
          return 'text-green-500'
     }
}
</script>
