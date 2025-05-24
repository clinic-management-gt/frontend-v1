<template>
     <div>
          <button type="submit" :class="[props.isDisabled ? colorsCatalog['gray'] : colorsCatalog[props.bgColor], 'w-full flex rounded-md px-3 py-1.5 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          props.additionalCSS]" :disabled="props.isDisabled">
               <slot />
          </button>
     </div>
</template>
<script setup>
const props = defineProps({
     bgColor: {
          type: String,
          default: 'clinic'
     },
     additionalCSS: {
          type: String,
          default: ''
     },
     isDisabled: {
          type: Boolean,
          default: false
     }
})

const colorsCatalog = {
     clinic: 'bg-primary-color focus-visible:outline-primary-color hover:bg-primary-color-variation-1 text-white',
     red: 'bg-red-500 focus-visible:outline-red-600 hover:bg-red-600 text-white',
     blue: 'bg-blue-500 focus-visible:outline-blue-600 hover:bg-blue-600 text-white',
     emerald: 'bg-emerald-500 focus-visible:outline-emerald-600 hover:bg-emerald-600 text-white',
     orange: 'bg-orange-500 focus-visible:outline-orange-600 hover:bg-orange-600 text-white',
     black: 'bg-black focus-visible:outline-black hover:bg-black text-white',
     white: 'bg-white-500 focus-visible:outline-white-600 hover:bg-white-600 text-black',
     gray: 'bg-gray-500 focus-visible:outline-white-600 hover:bg-white-600 text-white',
}
</script>