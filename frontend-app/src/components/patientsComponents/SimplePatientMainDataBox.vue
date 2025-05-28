<template>
  <div class="p-4">
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <h2 class="text-2xl font-bold">{{ data.name }} {{ data.lastName }}</h2>
        <div class="flex flex-wrap gap-4 mt-2 text-gray-700">
          <div>
            <p class="text-sm text-gray-500">Fecha de nacimiento</p>
            <p>{{ data.birthdate }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Edad</p>
            <p>{{ data.age }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Género</p>
            <p>{{ data.gender }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Información adicional si es necesaria -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="data.idNumber">
          <p class="text-sm text-gray-500">ID/Documento</p>
          <p>{{ data.idNumber }}</p>
        </div>
        <div v-if="data.bloodType">
          <p class="text-sm text-gray-500">Tipo de sangre</p>
          <p>{{ data.bloodType }}</p>
        </div>
        <div v-if="data.patientType">
          <p class="text-sm text-gray-500">Tipo de paciente</p>
          <p>{{ data.patientType }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({
      name: 'Sin nombre',
      lastName: '',
      birthdate: 'No disponible',
      age: 'No disponible',
      gender: 'No especificado',
      idNumber: '',
      bloodType: '',
      patientType: ''
    })
  }
});
</script>