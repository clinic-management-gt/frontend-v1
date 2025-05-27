<template>
  <div>
    <!-- Label opcional -->
    <CustomLabel
      v-if="title"
      :title="title"
      :name="name"
      :text-class="labelCss"
    />

    <!-- Input -->
    <div :class="{ 'mt-2': title && title !== 'general.empty' }" />

    <div class="relative w-full">
      <input
        :id="name"
        :name="name"
        :type="type"
        :placeholder="$t(inputPlaceholder)"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset sm:text-sm sm:leading-6 px-2 focus-visible:outline-[#489FB5] ring-[#489FB5]"
      />
    </div>
  </div>
</template>

<script setup>
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
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
</script>
