<template>
  <div>
    <custom-label
      v-if="title"
      :title="title"
      :name="name"
      :textClass="labelCss"
      :isRequired="required"
    />
    <fieldset>
      <div
        class="flex flex-col md:flex-row md:space-x-6 space-y-5 md:space-y-0"
      >
        <div
          v-for="d in data"
          :key="d.id"
          class="relative flex flex-row items-start"
        >
          <div class="flex h-6 items-center">
            <input
              :id="d.id"
              v-model="selected"
              :name="name"
              type="radio"
              :value="d.id"
              class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-patient-page-color checked:bg-patient-page-color focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patient-page-color disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
            />
          </div>
          <div class="ml-3 text-sm/6">
            <label class="font-medium text-gray-900">
              {{ $t(d.name) }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import { computed } from "vue";
import CustomLabel from "@/components/forms/CustomLabel.vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    required: true,
  },
  labelCss: {
    type: String,
    default: "font-bold",
  },
  currentSelected: {
    type: Number,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  setLocalMessage: {
    type: String,
    default: "general.empty",
  },
});

// declarar el emit para el v-model ("update:currentSelected")
const emit = defineEmits(["update:currentSelected"]);

// sustituir defineModel por un computed con getter/setter
const selected = computed({
  get: () => props.currentSelected,
  set: (val) => emit("update:currentSelected", val),
});
</script>
