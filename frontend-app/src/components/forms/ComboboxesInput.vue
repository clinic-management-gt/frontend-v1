<script setup>
import { ref, computed, watch } from "vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import CustomLabel from "@/components/forms/CustomLabel.vue";

const props = defineProps({
  data: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: true },
  title: { type: String, default: "general.empty" },
  placeholder: { type: String, default: "general.empty" },
  labelCss: { type: String, default: "font-bold" },
  isRequired: { type: Boolean, default: false },
});

const model = defineModel("currentSelected"); // Esto será un array de IDs
const selectedItems = ref([]);
const query = ref("");

// Mostrar nombres
const selectedDisplay = computed(() => {
  return selectedItems.value.map((i) => i.name).join(", ");
});

// Para mostrar los elementos visibles, usar `data` directamente
const fullData = computed(() => props.data);

// Convertir el modelo (array de IDs) en objetos (algunos conocidos, otros no)
watch(
  () => model.value,
  (newIds) => {
    if (!Array.isArray(newIds)) return;

    const knownIds = new Set(props.data.map((i) => i.id));
    selectedItems.value = newIds.map((id) => {
      const item = props.data.find((d) => d.id === id);
      return item ?? { id, name: `ID: ${id}` };
    });
  },
  { immediate: true },
);

// Convertir objetos seleccionados en array de IDs
watch(
  selectedItems,
  (items) => {
    const ids = items.map((i) => i.id);
    if (JSON.stringify(model.value) !== JSON.stringify(ids)) {
      model.value = ids;
    }
  },
  { deep: true },
);
</script>

<template>
  <div>
    <custom-label
      v-if="title"
      :title="title"
      :text-class="labelCss"
      :is-required="isRequired"
    />
    <Combobox as="div" :multiple="multiple" v-model="selectedItems">
      <div class="relative mt-2">
        <ComboboxInput
          class="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 border border-patient-page-color placeholder:text-gray-400 focus:border-patient-page-color focus:ring-patient-page-color focus:ring-1 focus:outline-none sm:text-sm"
          :placeholder="$t(placeholder)"
          @change="query = $event.target.value"
          @blur="query = ''"
          :display-value="() => selectedDisplay"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
        >
          <ChevronDownIcon class="size-5 text-patient-page-color" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="fullData.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
        >
          <ComboboxOption
            v-for="item in fullData"
            :key="item.id"
            :value="item"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'relative cursor-default px-3 py-2 select-none',
                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
              ]"
            >
              <span class="block truncate">{{ item.name }}</span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600"
              >
                <CheckIcon class="size-4" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
  </div>
</template>
