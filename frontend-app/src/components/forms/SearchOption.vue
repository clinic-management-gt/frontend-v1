<template>
  <form class="relative flex flex-1" @submit.prevent>
    <div class="relative w-full">
      <MagnifyingGlassIcon
        v-if="icon === 'MagnifyingGlassIcon'"
        class="pointer-events-none absolute inset-y-0 left-0 mt-1 pl-3 h-8 w-8 text-gray-400"
        aria-hidden="true"
      />
      <input
        id="search-field"
        :key="cleanText"
        :value="inputBinding"
        class="block w-full rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base"
        :placeholder="$t(textPlaceholder)"
        type="search"
        name="search"
        @input="e => inputBinding = e.target.value"
      />
    </div>
  </form>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  textPlaceholder: {
    type: String,
    default: 'general.empty'
  },
  cleanText: {
    type: Boolean,
    default: false
  }
});

// Computed con getter y setter para v-model + limpieza reactiva
const inputBinding = computed({
  get() {
    return props.cleanText ? '' : props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>
