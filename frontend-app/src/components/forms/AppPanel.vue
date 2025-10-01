<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-md">
    <div :class="[panelDesign]">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  panelDesign: {
    type: String,
    default: 'px-4 py-5 sm:p-6'
  },
});
</script>
