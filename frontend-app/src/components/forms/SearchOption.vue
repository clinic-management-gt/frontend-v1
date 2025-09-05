<template>
     <form class="relative flex flex-1" @submit.prevent>
          <div class="relative w-full">
               <MagnifyingGlassIcon v-if="props.icon == 'MagnifyingGlassIcon'"
                    class="pointer-events-none absolute inset-y-0 left-0 mt-1 pl-3 h-8 w-8 text-gray-400"
                    aria-hidden="true" />
               <input id="search-field" @input="search" :value="cleanInput"
                    class="block w-full rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base"
                    :placeholder="$t(props.textPlaceholder)" type="search" name="search" :key="cleanText" />
          </div>
     </form>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { ref, computed } from 'vue';
const emit = defineEmits(['search'])
const props = defineProps({
     icon: {
          type: String,
          default: null,
     },
     textPlaceholder: {
          type: String,
          default: 'general.empty',
     },
     cleanText: {
          type: Boolean,
     }
})
const inputValueRef = ref('')
const search = (e) => {
     inputValueRef.value = e.target.value
     emit('search', e.target.value)
}
const cleanInput = computed(() => {
     return props.cleanText ? inputValueRef.value = '' : inputValueRef.value
})
</script>
