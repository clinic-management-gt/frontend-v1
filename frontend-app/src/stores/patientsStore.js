import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const PatientsStore = defineStore('patients', () => {
     const appointments = ref([])

     const isLoadingPatientsStore = ref(false)
     const isLoadingAppointments = ref(false)

     async function fetchAppointments() {
          try {
               isLoadingAppointments.value = true
               const res = await fetch('http://localhost:9000/appointments')
               console.log(res)
               console.log(res.json())
               appointments.value = await res.json()
          } catch (error) {
               console.error('Error al obtener citas:', error)
          } finally {
               isLoadingAppointments.value = false
          }
     }

     return {
          appointments, isLoadingPatientsStore, isLoadingAppointments, 
          fetchAppointments
     }
}, {
     persist: {
          paths:[ 'appointments']
     }
})

