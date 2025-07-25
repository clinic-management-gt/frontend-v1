<template>
  <div>
  <custom-label v-if="title" :title="title" :name="name" :text-class="labelCss" :is-required="isRequired" />
  <Combobox as="div" v-model="selectedPerson" @update:modelValue="query = ''">
          <div class="relative mt-2">
               <ComboboxInput
                    class="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 border border-patient-page-color placeholder:text-gray-400 focus:border-patient-page-color focus:ring-patient-page-color focus:ring-1 focus:outline-none sm:text-sm"
                    :placeholder="$t(placeholder)" @change="query = $event.target.value" @blur="query = ''"
                    :display-value="(person) => person?.name" />
                    <ComboboxButton
                      class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                      <ChevronDownIcon class="size-5 text-patient-page-color " />
                    </ComboboxButton>

               <ComboboxOptions v-if="filteredPeople.length > 0 || query.length > 0"
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
                    <ComboboxOption v-if="queryPerson" :value="queryPerson" as="template" v-slot="{ active }">
                         <li
                              :class="['relative cursor-default px-3 py-2 select-none', active ? 'bg-indigo-600 text-white outline-hidden' : 'text-gray-900']">
                              <span class="block truncate">
                                   {{ query }}
                              </span>
                         </li>
                    </ComboboxOption>
                    <ComboboxOption v-for="person in filteredPeople" :key="person.id" :value="person" as="template"
                         v-slot="{ active }">
                         <li
                              :class="['relative cursor-default px-3 py-2 select-none', active ? 'bg-indigo-600 text-white outline-hidden' : 'text-gray-900']">
                              <span class="block truncate">
                                   {{ person.name }}
                              </span>
                         </li>
                    </ComboboxOption>
               </ComboboxOptions>
          </div>
     </Combobox>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import {
     Combobox,
     ComboboxButton,
     ComboboxInput,
     ComboboxLabel,
     ComboboxOption,
     ComboboxOptions,
} from '@headlessui/vue'

import CustomLabel from '@/components/forms/CustomLabel.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => {}
  },
  currentSelected: {
    type: Number,
    default: undefined
  },
  title: {
    type: String,
    default: 'general.empty'
  },
  placeholder: {
    type: String,
    default: 'general.empty'
  },
  isRequired: {
    type: Boolean,
    default: false
  }
})

const people = [
     { id: 1, name: 'Leslie Alexander' },
     { id: 2, name: 'neto' },
     { id: 3, name: 'Leslie Alexandsdader' },
     { id: 4, name: 'Leslie Alexandedaadsar' },
     { id: 5, name: 'Lesliedsad Alexander' },
     { id: 6, name: 'Lesdsalie Aldsaexadasnder' },
     { id: 7, name: 'ddddLeslddidde Alexander' },
     // More users...
]

const query = ref('')
const selectedPerson = ref(null)
const filteredPeople = computed(() =>
     query.value === ''
          ? people
          : people.filter((person) => {
               return person.name.toLowerCase().includes(query.value.toLowerCase())
          }),
)
const queryPerson = computed(() => {
     return query.value === '' ? null : { id: null, name: query.value }
})
</script>
