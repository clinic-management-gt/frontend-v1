<template>
     <div class="w-full ">
     <Combobox v-model="selected" @update:modelValue="onSelect">
          <div class="relative">
          <ComboboxInput
               class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-white placeholder:text-gray-400"
               :displayValue="displayText" :placeholder="placeholder" @change="query = $event.target.value" @focus="query = ''" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
          <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
          @after-leave="query = ''">
          <ComboboxOptions
               class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
               <!-- Mensaje si no se encuentra ningún paciente -->
               <div v-if="filteredPeople.length === 0 && query !== ''"
               class="relative cursor-default select-none px-4 py-2 text-gray-700">
              {{ $t('general.patient-not-found') }}
              </div>
               <!-- Opciones de pacientes -->
               <ComboboxOption v-for="person in filteredPeople" as="template" :key="person.id" :value="person"
               v-slot="{ selected, active }">
               <li class="relative cursor-default select-none py-2 pl-10 pr-4"
                    :class="{ 'bg-teal-600 text-white': active, 'text-gray-900': !active }">
                    <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                    {{ person.name }} {{ person.lastName }} ({{ person.gender }})
                    </span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{ 'text-white': active, 'text-teal-600': !active }">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
               </li>
               </ComboboxOption>
               </ComboboxOptions>
          </TransitionRoot>
          </div>
     </Combobox>
     </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

// Definición de props y eventos
const emit = defineEmits(['update:currentSelected'])
const props = defineProps({
     data: {
      type: Array,
      default: () => []
     },
     currentSelected: {
      type: Number,
      default: undefined
     },
     placeholder: {
      type: String,
      default: ''
     },
     isRequired: {
      type: Boolean,
      default: false
     }
})

// Lista de personas (pacientes) a mostrar
const people = computed(() => Array.isArray(props.data) && props.data.length > 0 ? props.data : [])

// Paciente seleccionado actualmente
const selected = ref(null)
// Texto de búsqueda actual
const query = ref('')

// Sincroniza el valor seleccionado externo con el interno
watch(() => props.currentSelected, (newVal) => {
     selected.value = people.value.find(p => p.id === newVal) || null
})

// Cuando se selecciona un paciente, emite el id al padre
function onSelect(newVal) {
     selected.value = newVal
     emit('update:currentSelected', newVal?.id)
}

// Muestra el nombre del paciente seleccionado en el input, o el placeholder si no hay selección
function displayText(person) {
     if (!person || query.value !== '') return ''
     return `${person.name} ${person.lastName} (${person.gender})`
}

// Filtra la lista de pacientes según el texto de búsqueda
const filteredPeople = computed(() =>
     query.value === ''
     ? people.value
     : people.value.filter((person) =>
          (`${person.name} ${person.lastName}` || '')
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
     )
)
</script>
