
<template>
  <div>
    <custom-label
      v-if="title"
      :title="title"
      :text-class="labelCss"
      :is-required="isRequired"
    />
    <Combobox as="div" multiple v-model="selectedItems">
      <div class="relative mt-2">
        <ComboboxInput
          class="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 border border-patient-page-color placeholder:text-gray-400 focus:border-patient-page-color focus:ring-patient-page-color focus:ring-1 focus:outline-none sm:text-sm"
          :placeholder="$t(placeholder)"
          @change="query = $event.target.value"
          @blur="query = ''"
          :display-value="() => selectedDisplay"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronDownIcon class="size-5 text-patient-page-color" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredData.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
          <ComboboxOption
            v-for="item in filteredData"
            :key="item.id"
            :value="item"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="['relative cursor-default px-3 py-2 select-none', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
              <span class="block truncate">
                {{ item.name }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                <CheckIcon class="size-4" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'
import CustomLabel from '@/components/forms/CustomLabel.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  title: { type: String, default: 'general.empty' },
  placeholder: { type: String, default: 'general.empty' },
  labelCss: { type: String, default: 'font-bold' },
  isRequired: { type: Boolean, default: false }
})

const selectedIds = defineModel('currentSelected', { type: Array, default: () => [] })
const selectedItems = ref([])

const query = ref('')

// Mostrar nombres concatenados en el input
const selectedDisplay = computed(() =>
  selectedItems.value.map(item => item.name).join(', ')
)

// Siempre mostrar toda la data (sin filtrarla)
const filteredData = computed(() => props.data)

// Sincronizar al recibir ids desde el padre
watch(
  () => selectedIds.value,
  (newIds) => {
    selectedItems.value = props.data.filter(item => newIds.includes(item.id))
  },
  { immediate: true }
)

// Cuando cambian los objetos seleccionados, actualizar los ids
watch(
  selectedItems,
  (items) => {
    selectedIds.value = items.map(item => item.id)
  },
  { deep: true }
)
</script>
