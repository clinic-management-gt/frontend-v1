<template>
     <div class="px-6 py-8 max-w-4xl mx-auto">
       <h1 class="text-4xl font-bold text-red-600 mb-8">Dashboard</h1>
   
       <div v-for="appointment in todaysAppointments" :key="appointment.patientName + appointment.date"
         class="bg-white shadow-md rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
         
         <p class="text-lg font-semibold mb-1">
           <span class="font-bold">Paciente:</span> {{ appointment.patientName }}
         </p>
         <p class="text-gray-600 mb-3">
           <span class="font-semibold">Médico:</span> {{ appointment.doctorName }}
         </p>
   
         <p class="mb-3">
           <span class="font-semibold">Estado:</span>
           <span :class="statusClass(appointment.status)" class="inline-block px-3 py-1 rounded-full text-white text-sm font-medium">
             {{ appointment.status }}
           </span>
         </p>
   
         <p class="text-gray-500 text-sm">
           <span class="font-semibold">Fecha y Hora:</span> {{ formatDateTime(appointment.date) }}
         </p>
       </div>
     </div>
   </template>
   
   <script setup>
   import { ref, onMounted, computed } from 'vue'
   
   const appointments = ref([])
   
   async function fetchAppointments() {
     try {
       const res = await fetch('http://localhost:9000/appointments')
       appointments.value = await res.json()
     } catch (error) {
       console.error('Error al obtener citas:', error)
     }
   }
   
   onMounted(() => {
     fetchAppointments()
   })
   
   const todaysAppointments = computed(() => {
     const today = new Date()
     return appointments.value.filter(app => {
       const appDate = new Date(app.date)
       return (
         appDate.getDate() === today.getDate() &&
         appDate.getMonth() === today.getMonth() &&
         appDate.getFullYear() === today.getFullYear()
       )
     })
   })
   
   function statusClass(status) {
     switch (status.toLowerCase()) {
       case 'completado': return 'bg-green-500'
       case 'confirmado': return 'bg-blue-500'
       case 'pendiente': return 'bg-yellow-500 text-yellow-900'
       case 'cancelado': return 'bg-red-500'
       default: return 'bg-gray-400'
     }
   }
   
   function formatDateTime(dateString) {
     const options = {
       year: 'numeric', month: 'numeric', day: 'numeric',
       hour: 'numeric', minute: 'numeric',
       hour12: true
     }
     return new Date(dateString).toLocaleString('es-GT', options)
   }
   </script>
   
   <style scoped>
   /* Puedes agregar estilos personalizados si lo deseas */
   </style>
   