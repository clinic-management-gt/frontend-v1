<template>
     <div class="px-4 sm:px-0">
          <div class="mt-4 flow-root">
               <div class="-mx-4 -my-2 overflow-x-auto">
                    <div class="inline-block min-w-full align-middle sm:px-4">
                         <table class="min-w-full divide-y divide-gray-300">
                              <thead>
                                   <tr class="py-2">
                                        <th v-for="(header, index) in props.data.headers.filter(h => h.visible)"
                                             :key="index" scope="col"
                                             :class="[header.sortable ? 'px-2 py-4 text-left text-sm font-semibold text-gray-400 hover:text-gray-700 truncate' : 'flex text-sm text-gray-400 justify-between py-2 px-2']">
                                             <button v-if="header.sortable" @click="toggleSort(header.key)"
                                                  :class="['flex items-center focus:outline-none transition-transform duration-300 transform hover:scale-110', header.current ? 'font-bold text-black' : '']">
                                                  <arrow-long-up-icon :class="{
                                                       'rotate-180': sortConfig.key === header.key && sortConfig.direction === 'desc'
                                                  }" class="h-5 w-5" />
                                                  {{ $t(header.label) }}
                                             </button>
                                             <button v-else-if="header.hasAction" class="flex justify-start py-2 px-2">
                                                  <action-button-solid-icon v-if="header.buttonType === 'solidIcon'"
                                                       :icon="header.iconType" size="h-8 w-8"
                                                       @click="header.action" />
                                                  <action-button-outlined-icon v-if="header.buttonType === 'outlineIcon'"
                                                       :icon="header.iconType"
                                                       @click="header.action" class="h-6 w-6 mr-1" />
                                             </button>
                                             <p v-else>{{ $t(header.label) }}</p>
                                        </th>
                                   </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-200 bg-white">
                                   <tr v-if="props.data.displayData.length === 0 || props.isLoadingContent">
                                        <td class="  justify-center text-gray-500  text-center text-sm py-4"
                                             :colspan="props.data.headers.filter(h => h.visible).length">
                                             <spinner-loading class="mx-auto" v-if="props.isLoadingContent" />
                                             <span v-else-if="props.data.displayData.length === 0">
                                                  {{ $t(props.data.noDataMessage) }}
                                             </span>
                                        </td>
                                   </tr>
                                   <tr v-else v-for="(item, index) in displayedItems" :key="index">
                                        <td v-for="header in props.data.headers.filter(h => h.visible)"
                                             :key="header.key"
                                             :class="[header.key === 'actions' ? 'text-end' : getArrayValue(item[header.key], 'style')]"
                                             class="cursor-pointer">
                                             <div @click="item.action">
                                                  <span v-if="Array.isArray(item[header.key])">
                                                       <span
                                                            v-if="getArrayValue(item[header.key], 'hasLabel') === 'true'">
                                                            {{ getArrayValue(item[header.key], 'label') }}
                                                       </span>
                                                       <span
                                                            v-else-if="getArrayValue(item[header.key], 'isIcon') === 'true'">
                                                            <action-button-solid-icon
                                                                 :icon="getArrayValue(item[header.key], 'iconType')"
                                                                 size="h-6 w-6" />
                                                       </span>
                                                       <span v-else>
                                                            {{ getArrayValue(item[header.key], header.key) }}
                                                       </span>
                                                  </span>
                                             </div>
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                         <div class="relative">
                              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                   <div class="w-full border-t border-gray-300" />
                              </div>
                         </div>
                         <div class="mt-6 flex justify-between ">
                              <div class="flex items-center">
                                   <label for="itemsPerPage">{{ $t('general.results-per-page') }}</label>
                                   <select v-model="itemsPerPage" id="itemsPerPage" class="ml-2 border:bg-emerald-500">
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                   </select>
                              </div>
                              <div class="flex items-center">
                                   <action-button-solid-icon v-if="currentPage != 1" icon="ChevronLeftIcon"
                                        @click="previousPage" size="h-6 w-6" />
                                   <span class="">{{ $t('general.number-of-pages') }} {{
                                        currentPage }}-{{
                                             pageCount }}</span>
                                   <action-button-solid-icon v-if="currentPage != pageCount" icon="ChevronRightIcon"
                                        @click="nextPage" size="h-6 w-6" />
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup>
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline'
import { computed, ref, defineAsyncComponent } from 'vue'
import { DateTime } from 'luxon'

const SpinnerLoading = defineAsyncComponent(() => import('@components/forms/BasicSpinnerLoading.vue'))

import ActionButtonOutlinedIcon from '@components/forms/ActionButtonOutlinedIcon.vue';
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue';

const emit = defineEmits(['update:sort'])
const props = defineProps({
     data: {
          type: Object,
          required: true
     },
     isLoadingContent: {
          type: Boolean,
          default: false,
     },
     defaultSort: {
          type: Object,
          default: { key: '', direction: 'asc' },
     }
})

const getArrayValue = (arr, key) => {
     if (!arr) return ''
     return arr.map(item => typeof item === 'object' ? item[key] : item).join(', ')
}

const sortConfig = ref(props.defaultSort)
const toggleSort = (key) => {
     if (sortConfig.value.key === key) {
          props.data.headers.forEach(element => {
               if (element.key === sortConfig.value.key) {
                    element.current = true
               } else {
                    element.current = false
               }
          })
          console.log(props.data.headers)
          sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
     } else {
          sortConfig.value = { key, direction: 'asc' }
     }
     emit('update:sort', sortConfig.value)
}
const compareValues = (a, b, type = 'string') => {
     if (a == null) a = ''
     if (b == null) b = ''
     switch (type) {
          case 'number':
               return parseFloat(a) - parseFloat(b)
          case 'date':
               return DateTime.fromISO(a) - DateTime.fromISO(b)
          case 'boolean':
               return (a === b) ? 0 : a ? -1 : 1
          default:
               return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
     }
}
const tableData = computed(() => {
     let sortedData = [...props.data.displayData]
     if (sortConfig.value.key) {
          const header = props.data.headers.find(h => h.key === sortConfig.value.key)
          if (header) {
               sortedData.sort((a, b) => {
                    let aValue = a[sortConfig.value.key]
                    let bValue = b[sortConfig.value.key]
                    if (Array.isArray(aValue)) {
                         aValue = aValue.map(item =>
                              header.valueKey && typeof item === 'object' ? item[header.valueKey] : item
                         ).join(', ')
                         bValue = bValue.map(item =>
                              header.valueKey && typeof item === 'object' ? item[header.valueKey] : item
                         ).join(', ')
                    }
                    const compareResult = compareValues(aValue, bValue, header.sortType)
                    return sortConfig.value.direction === 'asc' ? compareResult : -compareResult
               })
          }
     }
     return sortedData
})

const itemsPerPage = ref(10)
const currentPage = ref(1)
const displayedItems = computed(() => {
     const perPage = parseInt(itemsPerPage.value, 10)
     const startIndex = (currentPage.value - 1) * perPage
     const endIndex = startIndex + perPage
     return tableData.value.slice(startIndex, endIndex)
});
const pageCount = computed(() => {
     return Math.ceil(props.data.displayData.length / itemsPerPage.value)
})
const previousPage = () => {
     if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
     if (currentPage.value < pageCount.value) currentPage.value++
}
</script>
