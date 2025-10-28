<template>
  <div class="w-full">
    <Combobox v-model="selected" @update:model-value="onSelect">
      <div class="relative">
        <ComboboxInput
          class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-white placeholder:text-gray-400"
          :displayValue="displayText"
          :placeholder="placeholder"
          @change="query = $event.target.value"
          @focus="query = ''"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700"
            >
              {{ $t("general.patient-not-found") }}
            </div>

            <!-- Opciones de pacientes -->
            <ComboboxOption
              v-for="person in filteredPeople"
              :key="person.id"
              v-slot="{ selected: isSelected, active }"
              as="template"
              :value="person"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': isSelected, 'font-normal': !isSelected }"
                >
                  {{ person.name }} {{ person.lastName }} ({{ person.gender }})
                </span>
                <span
                  v-if="isSelected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
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
import { ref, computed, watch } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const emit = defineEmits(["update:currentSelected"]);
const props = defineProps({
  data: { type: Array, default: () => [] },
  currentSelected: { type: Number, default: undefined },
  placeholder: { type: String, default: "" },
  isRequired: { type: Boolean, default: false },
});

const people = computed(() =>
  Array.isArray(props.data) && props.data.length > 0 ? props.data : []
);

const selected = ref(null);
const query = ref("");

// Sincroniza selección externa → interna
watch(
  () => props.currentSelected,
  (newVal) => {
    selected.value = people.value.find((p) => p.id === newVal) || null;
  },
  { immediate: true }
);

// Emitir id al seleccionar
function onSelect(newVal) {
  selected.value = newVal;
  emit("update:currentSelected", newVal?.id);
}

// Texto mostrado en el input
function displayText(person) {
  if (!person || query.value !== "") return "";
  const name = person?.name ?? "";
  const last = person?.lastName ?? "";
  const gender = person?.gender ?? "";
  return `${name} ${last} (${gender})`;
}

// Filtro por query (sin `??` inválido)
const filteredPeople = computed(() => {
  const q = query.value.toLowerCase().replace(/\s+/g, "");
  if (!q) return people.value;

  return people.value.filter((person) => {
    const name = (person?.name ?? "").toLowerCase();
    const last = (person?.lastName ?? "").toLowerCase();
    const merged = (name + " " + last).replace(/\s+/g, "");
    return merged.includes(q);
  });
});
</script>
