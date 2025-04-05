<script setup>
import { ref, onMounted } from 'vue'

const pacientes = ref([])

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + '/pacientes')
    pacientes.value = await res.json()
  } catch (error) {
    console.error('Error al conectar con el backend:', error)
  }
})
</script>

<template>
  <div style="padding: 2rem">
    <h1>Pacientes</h1>
    <ul>
      <li v-for="p in pacientes" :key="p.id">{{ p.nombre }}</li>
    </ul>
  </div>
</template>


