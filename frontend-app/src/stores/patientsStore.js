import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsStore = defineStore('patients', () => {
  const appointments = ref([])
  const allPatients = ref([])
  const currentPatientSelectedId = ref(undefined)
  const currentPatientSelectedData = ref(undefined)

  const isLoadingPatientsStore = ref(false)
  const isLoadingAppointments = ref(false)
  const isLoadingAllPatients = ref(false)
  const isLoadingPatientData = ref(false)

  function setPatientsData(id) {
    currentPatientSelectedId.value = id
    fetchPatientData()
  }

  async function fetchAppointments() {
    try {
      isLoadingAppointments.value = true
      const res = await fetch('http://localhost:9000/appointments')
      if (!res.ok) {
        console.error(`Error ${res.status} al obtener citas:`, await res.text())
        return
      }
      appointments.value = await res.json()
    } catch (error) {
      console.error('Error al obtener citas:', error)
    } finally {
      isLoadingAppointments.value = false
    }
  }

  async function fetchAllPatients() {
    try {
      isLoadingAllPatients.value = true
      const res = await fetch('http://localhost:9000/patients')
      if (!res.ok) {
        console.error(`Error ${res.status} al obtener pacientes:`, await res.text())
        return
      }
      allPatients.value = await res.json()
    } catch (error) {
      console.error('Error al obtener pacientes:', error)
    } finally {
      isLoadingAllPatients.value = false
    }
  }

  async function fetchPatientData() {
    if (!currentPatientSelectedId.value) {
      console.warn('ID de paciente no definido')
      return
    }
    try {
      isLoadingPatientData.value = true
      const url = `http://localhost:9000/patients/${currentPatientSelectedId.value}`
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`Error ${res.status} al obtener data del paciente:`, await res.text())
        return
      }
      currentPatientSelectedData.value = await res.json()
    } catch (error) {
      console.error('Error al obtener data del paciente:', error)
    } finally {
      isLoadingPatientData.value = false
    }
  }

  return {
    // state
    appointments,
    allPatients,
    currentPatientSelectedId,
    currentPatientSelectedData,
    isLoadingPatientsStore,
    isLoadingAppointments,
    isLoadingAllPatients,
    isLoadingPatientData,
    // actions
    setPatientsData,
    fetchAppointments,
    fetchAllPatients,
    fetchPatientData,
  }
}, {
  persist: {
    paths: [
      'appointments',
      'allPatients',
      'currentPatientSelectedId',
      'currentPatientSelectedData'
    ]
  }
})
