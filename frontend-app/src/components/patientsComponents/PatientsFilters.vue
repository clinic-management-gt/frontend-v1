<template>
     <Disclosure as="section" aria-labelledby="filter-heading" class="grid items-center border-b border-gray-200">
          <h2 id="filter-heading" class="sr-only">Filters</h2>
          <div class="relative col-start-1 row-start-1 py-4">
               <div class="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                    <div class="pr-6">
                         <DisclosureButton class="group flex items-center font-medium text-gray-700">
                              <funnel-icon class="mr-2 size-5 flex-none text-emerald-600 group-hover:text-gray-500"
                                   aria-hidden="true" />
                              {{ filterCount + ' ' + $t('general.filters') }}
                         </DisclosureButton>
                    </div>
                    <div class="pl-6">
                         <button type="button" class="text-gray-500" @click="clearSearchCriteria()">{{
                              $t('general.clear-all') }}</button>
                    </div>
               </div>
          </div>
          <DisclosurePanel class="border-t border-gray-200 py-6">
               <form class="px-2 lg:px-2 align-items-between">
                    <div
                         class="grid grid-cols-1 flex gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                         <div class="flex flex-col">
                              <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{
                                   $t('protocol-instruments.writing-number') }}</p>
                              <search-option :clean-text="clearText"
                                   @search="updateSearchCriteria('writingNumber', $event)" icon="MagnifyingGlassIcon"
                                   textPlaceholder="protocol-instruments.writing-number" />
                         </div>
                         <div class="flex flex-col">
                              <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{
                                   $t('protocol-instruments.customer') }}</p>
                              <search-option :clean-text="clearText" @search="updateSearchCriteria('customer', $event)"
                                   icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.customer" />
                         </div>
                         <div class="flex flex-col">
                              <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{
                                   $t('protocol-instruments.type-of-instrument') }}</p>
                              <search-option :clear-text="clearText"
                                   @search="updateSearchCriteria('instrumentType', $event)" icon="MagnifyingGlassIcon"
                                   textPlaceholder="protocol-instruments.type-of-instrument" />
                         </div>
                         <div class="flex flex-col">
                              <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{
                                   $t('protocol-instruments.state')
                              }}</p>
                              <search-option :clean-text="clearText" @search="updateSearchCriteria('state', $event)"
                                   icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.state" />
                         </div>
                         <div class="flex flex-col ">
                              <custom-label title="general.lawyer" name="" class="mb-2" />
                              <lawyer-select class="" />
                         </div>
                    </div>
               </form>
          </DisclosurePanel>
     </Disclosure>
</template>
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { FunnelIcon } from '@heroicons/vue/20/solid'
import { reactive, watchEffect, ref, nextTick, computed } from 'vue'

import CustomLabel from '../forms/CustomLabel.vue'
import SearchOption from '@/components/forms/SearchOption.vue'
import LawyerSelect from '@/components/forms/LawyerSelect.vue'

const emit = defineEmits(['FilteredData'])
const props = defineProps({
     data: {
          type: Array,
          default: () => []
     }
})
const filteredItems = ref([])
const clearText = ref(false)

const searchCriteria = reactive({
     writingNumber: '',
     customer: '',
     instrumentType: '',
     state: '',
})
const updateSearchCriteria = (key, value) => {
     searchCriteria[key] = value
}
const clearSearchCriteria = () => {
     clearText.value = true
     Object.keys(searchCriteria).forEach(key => {
          searchCriteria[key] = ''
     })
     nextTick(() => {
          clearText.value = false
     })
}
const filterCount = computed(() => {
     return Object.values(searchCriteria).filter(value => value !== '').length
})
watchEffect(() => {
     filteredItems.value = props.data.filter(item => {
          const writingNumberMatch = !searchCriteria.writingNumber || item.number === Number(searchCriteria.writingNumber)
          const customerMatch = !searchCriteria.customer || item.client.toLowerCase().includes(searchCriteria.customer.toLowerCase())
          const instrumentMatch = !searchCriteria.typeInstrument || item.instrumentType.name.toLowerCase().includes(searchCriteria.typeInstrument.toLowerCase())
          const stateMatch = !searchCriteria.state || item.instrumentStatus.name.toLowerCase().includes(searchCriteria.state.toLowerCase())
          return writingNumberMatch && customerMatch && instrumentMatch && stateMatch
     })
     emit('FilteredData', filteredItems)
})
</script>