<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-95"
  >
    <div
      class="bg-gray-200 rounded-lg shadow-lg w-full max-w-xl p-8 flex flex-col gap-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">
          {{ $t("patients.consult-detail") }}
        </h2>
        <button
          class="text-gray-500 hover:text-gray-800 text-2xl"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-blue-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">
            {{ $t("patients.evolution-note") }}
          </h3>
          <div class="text-gray-400 italic py-4">
            (Aquí irá la nota de evolución)
          </div>
        </div>
        <div class="bg-blue-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">
            {{ $t("patients.medical-recipe") }}
          </h3>
          <div v-if="recipe">
            <div class="text-sm text-gray-500 mb-2">
              Fecha: {{ recipe.createdAt }}
            </div>
            <div class="whitespace-pre-line">
              {{ recipe.prescription }}
            </div>
          </div>
          <div
            v-else
            class="text-gray-400 italic"
          >
            {{ $t("patients.no-recipe-selected") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  recipe: {
    type: Object,
    default: null,
  },
});
</script>
