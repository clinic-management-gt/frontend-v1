<template>
  <div :class="[panelDesign]">
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({
  panelDesign: {
    type: String,
    default: 'overflow-hidden rounded-lg bg-white shadow-md px-4 py-5 sm:p-6'
  },
});
</script>
