<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Historial Médico</h3>
    <div class="space-y-6">
      <div v-for="record in data" :key="record.id" class="border-b border-gray-200 pb-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-medium">{{ record.type }}</p>
            <p class="text-gray-600 text-sm">{{ record.longSpanishDate || 'Fecha no disponible' }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p class="text-gray-600 text-sm">Peso:</p>
            <p>{{ record.weight }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Altura:</p>
            <p>{{ record.height }}</p>
          </div>
        </div>
        
        <div class="mb-2">
          <p class="text-gray-600 text-sm">Antecedentes familiares:</p>
          <p>{{ record.familyHistory }}</p>
        </div>
        
        <div>
          <p class="text-gray-600 text-sm">Notas:</p>
          <p>{{ record.notes }}</p>
        </div>
      </div>
      
      <div v-if="data.length === 0" class="text-center text-gray-500">
        No hay registros médicos disponibles
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
</script>