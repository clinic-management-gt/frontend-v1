<template>
     <div>
          <CustomLabel v-if="props.title" :title="props.title" :name="props.name" :text-class="props.labelCss" />
          <div :class="{ 'mt-2': props.title && props.title !== 'general.empty' }" />

          <div class="relative w-full">
               <input :placeholder="$t(props.inputPlaceholder)"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset sm:text-sm sm:leading-6 px-2 focus-visible:outline-[#489FB5] ring-[#489FB5]" />
          </div>
     </div>
</template>

<script setup>
import CustomLabel from './CustomLabel.vue'

const props = defineProps({
     name: {
          type: String,
          default: 'general.empty'
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
})
</script>
