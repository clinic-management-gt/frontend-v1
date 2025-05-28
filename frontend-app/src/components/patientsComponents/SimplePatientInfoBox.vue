<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Información Importante</h3>
    <div class="space-y-4">
      <div>
        <p class="text-gray-600">Última visita:</p>
        <p class="font-medium">{{ data.lastVisit }}</p>
      </div>
      <div>
        <p class="text-gray-600">Fecha de nacimiento:</p>
        <p class="font-medium">{{ data.birthdate }}</p>
      </div>
      <div>
        <p class="text-gray-600">Edad:</p>
        <p class="font-medium">{{ data.age }}</p>
      </div>
      <div>
        <p class="text-gray-600">Alergias:</p>
        <ul class="list-disc pl-5">
          <li v-for="(alergia, index) in data.alergies" :key="index">
            {{ alergia }}
          </li>
          <li v-if="!data.alergies?.length">Sin alergias registradas</li>
        </ul>
      </div>
      <div>
        <p class="text-gray-600">Síndromes:</p>
        <ul class="list-disc pl-5">
          <li v-for="(sindrome, index) in data.syndrome" :key="index">
            {{ sindrome }}
          </li>
          <li v-if="!data.syndrome?.length">Sin síndromes registrados</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({
      lastVisit: 'No disponible',
      birthdate: 'No disponible',
      age: 'No disponible',
      alergies: [],
      syndrome: []
    })
  }
});
</script>