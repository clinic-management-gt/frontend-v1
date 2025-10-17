<template>
  <div class="flex justify-center items-center">
    <ArrowPathIcon
      :class="['w-12 h-12 animate-spin-smooth', color]"
    />
  </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/solid';
defineProps({
    color: {
        type: String,
        default: 'text-patient-page-color'
    }
});
</script>

<style scoped>
@keyframes smooth-spin {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(360deg);
    }
    50% {
        transform: rotate(720deg);
    }
    60% {
        transform: rotate(720deg);
    }
    75% {
        transform: rotate(720deg);
    }
    100% {
        transform: rotate(1080deg);
    }
}

/* Usamos la animación personalizada como una clase para aplicar la rotación */
.animate-spin-smooth {
    animation: smooth-spin 3s cubic-bezier(0.4, 0.5, 0.2, 1) infinite;
}
</style>
