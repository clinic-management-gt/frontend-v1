<template>
  <div>
    <!-- Label opcional -->
    <CustomLabel v-if="title" :title="title" :name="name" :text-class="labelCss" />
    <div :class="{ 'mt-2': title && title !== 'general.empty' }" />
    <!-- Input -->
    <div class="relative w-full">
      <input :id="name" :name="name" :type="type" :placeholder="$t(inputPlaceholder)" :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" :required="required" :class="[
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset sm:text-sm sm:leading-6 px-2',
          ringColorClass,
          focusOutlineClass
        ]" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CustomLabel from './CustomLabel.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'general.empty'
  },
  type: {
    type: String,
    default: 'text'
  },
  inputPlaceholder: {
    type: String,
    default: 'general.empty'
  },
  title: {
    type: String,
    default: 'general.empty'
  },
  labelCss: {
    type: String,
    default: 'font-bold'
  },
  inputColor: {
    type: String, 
    default: '[#489FB5]'
  },
  required: {
    type: Boolean,
    default: false
  }
})
const ringColorClass = computed(() => {
  switch (props.inputColor) {
    case 'patient-page-color':
      return 'ring-patient-page-color'
    case 'primary-color':
      return 'ring-primary-color'
    case 'primary-color-variation-1':
      return 'ring-primary-color-variation-1'
    case 'primary-color-variation-2':
      return 'ring-primary-color-variation-2'
    default:
      return 'ring-gray-300' // fallback
  }
})

const focusOutlineClass = computed(() => {
  switch (props.inputColor) {
    case 'patient-page-color':
      return 'focus-visible:outline-patient-page-color'
    case 'primary-color':
      return 'focus-visible:outline-primary-color'
    case 'primary-color-variation-1':
      return 'focus-visible:outline-primary-color-variation-1'
    case 'primary-color-variation-2':
      return 'focus-visible:outline-primary-color-variation-2'
    default:
      return 'focus-visible:outline-gray-300' // fallback
  }
})


const emit = defineEmits(['update:modelValue'])
</script>
