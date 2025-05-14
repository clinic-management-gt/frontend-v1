import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const PatientsStore = defineStore('patients', () => {
  const appointments = ref([])
  const isLoadingAppointments = ref(false)
  const isLoadingPatientsStore = ref(false)

  async function fetchAppointments() {
    try {
      isLoadingAppointments.value = true

      const res = await fetch('http://localhost:9000/appointments')
      if (!res.ok) {
        // Opcional: maneja errores de HTTP
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()     // ← Aquí consumes el body sólo una vez
      console.log('Datos recibidos:', data)
      appointments.value = data

    } catch (error) {
      console.error('Error al obtener citas:', error)
    } finally {
      isLoadingAppointments.value = false
    }
  }

  return {
    appointments,
    isLoadingAppointments,
    isLoadingPatientsStore,
    fetchAppointments
  }
}, {
  persist: {
    paths: ['appointments']
  }
})
