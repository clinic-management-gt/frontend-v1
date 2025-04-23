<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

// const pacientes = ref([])
// onMounted(async () => {
//   try {
//     const res = await fetch(import.meta.env.VITE_API_URL + '/pacientes')
//     pacientes.value = await res.json()
//   } catch (error) {
//     console.error('Error al conectar con el backend:', error)
//   }
// })
</script>