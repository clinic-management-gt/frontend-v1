<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Datos de Contacto</h3>
    <div class="space-y-3">
      <div v-if="data">
        <p class="text-gray-600">Teléfono:</p>
        <p class="font-medium">{{ data.phone || 'No disponible' }}</p>
      </div>
      <div v-if="data">
        <p class="text-gray-600">Correo electrónico:</p>
        <p class="font-medium">{{ data.email || 'No disponible' }}</p>
      </div>
      <div v-if="data">
        <p class="text-gray-600">Dirección:</p>
        <p class="font-medium">{{ data.address || 'No disponible' }}</p>
      </div>
      
      <div v-if="data && data.tutors && data.tutors.length">
        <p class="text-gray-600">Tutores:</p>
        <ul class="list-disc pl-5">
          <li v-for="(tutor, index) in data.tutors" :key="index">
            {{ tutor && tutor.parent ? `${tutor.parent.name || ''} ${tutor.parent.lastName || ''}` : 'No disponible' }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-gray-600">Tutores:</p>
        <p class="font-medium">Sin tutores registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({
      phone: 'No disponible',
      email: 'No disponible',
      address: 'No disponible',
      tutors: []
    })
  }
});
</script>