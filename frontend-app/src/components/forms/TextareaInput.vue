<template>
  <div>
    <!-- Label opcional -->
    <CustomLabel
      v-if="title"
      :title="title"
      :name="name"
      :textClass="labelCss"
    />
    <div :class="{ 'mt-2': title && title !== 'general.empty' }"></div>
    <!-- Textarea -->
    <div class="relative w-full">
      <textarea
        :id="name"
        v-model="value"
        :name="name"
        :placeholder="$t(inputPlaceholder)"
        :required="required"
        :rows="rows"
        :class="[
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset sm:text-sm sm:leading-6 px-3 resize-none',
          ringColorClass,
          focusOutlineClass,
        ]"
        @blur="handleBlur"
      ></textarea>
    </div>
    <!-- Mensaje de error -->
    <p
      v-if="errorMessage"
      class="mt-1 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { computed } from "vue";
import CustomLabel from "./CustomLabel.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  inputPlaceholder: {
    type: String,
    default: "general.empty",
  },
  title: {
    type: String,
    default: "general.empty",
  },
  labelCss: {
    type: String,
    default: "font-bold",
  },
  inputColor: {
    type: String,
    default: "[#489FB5]",
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
});

const { value, errorMessage, handleBlur } = useField(props.name);

const ringColorClass = computed(() => {
  switch (props.inputColor) {
    case "patient-page-color":
      return "ring-patient-page-color";
    case "primary-color":
      return "ring-primary-color";
    case "primary-color-variation-1":
      return "ring-primary-color-variation-1";
    case "primary-color-variation-2":
      return "ring-primary-color-variation-2";
    default:
      return "ring-gray-300";
  }
});

const focusOutlineClass = computed(() => {
  switch (props.inputColor) {
    case "patient-page-color":
      return "focus-visible:outline-patient-page-color";
    case "primary-color":
      return "focus-visible:outline-primary-color";
    case "primary-color-variation-1":
      return "focus-visible:outline-primary-color-variation-1";
    case "primary-color-variation-2":
      return "focus-visible:outline-primary-color-variation-2";
    default:
      return "focus-visible:outline-gray-300";
  }
});
</script>