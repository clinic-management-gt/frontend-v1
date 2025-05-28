import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsStore = defineStore('patients', () => {
  const appointments = ref([])
  const appointmentsToday = ref([])
  const allPatients = ref([])
  const currentPatientSelectedId = ref(undefined)
  const currentPatientSelectedData = ref(undefined)

  const isLoadingPatientsStore = ref(false)
  const isLoadingAppointments = ref(false)
  const isLoadingAppointmentsToday = ref(false)
  const isLoadingAllPatients = ref(false)
  const isLoadingPatientData = ref(false)

  const currentPatientMedicalRecords = ref(undefined)
  const isLoadingMedicalRecords = ref(false)

  function setPatientsData(id) {
    currentPatientSelectedId.value = id
    fetchPatientData()
    fetchPatientMedicalRecords()
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

  async function fetchAppointmentsToday() {
    try {
      isLoadingAppointmentsToday.value = true
      const res = await fetch('http://localhost:9000/appointments/today')
      if (!res.ok) {
        console.error(`Error ${res.status} al obtener citas de hoy:`, await res.text())
        return
      }
      appointmentsToday.value = await res.json()
    } catch (error) {
      console.error('Error al obtener citas de hoy:', error)
    } finally {
      isLoadingAppointmentsToday.value = false
    }
    
  }

  // patientsStore.js
  async function updateAppointmentStatus(id, newStatus) {
    try {
      const res = await fetch(`http://localhost:9000/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        console.error(`Error ${res.status}:`, await res.text());
        return false;
      }
      // Si todo OK, actualizo sólo ese elemento en el array:
      const idx = appointmentsToday.value.findIndex(a => a.id === id);
      if (idx !== -1) {
        appointmentsToday.value[idx].status = newStatus;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
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

  async function fetchPatientMedicalRecords() {
    if (!currentPatientSelectedId.value) return
    isLoadingMedicalRecords.value = true
    try {
      const res = await fetch(`http://localhost:9000/Patients/${currentPatientSelectedId.value}/medicalrecords`)
      if (!res.ok) throw new Error('Error al obtener medical records')
      const result = await res.json()
      // Si el backend devuelve un objeto, conviértelo en array
      currentPatientMedicalRecords.value = Array.isArray(result) ? result : [result]
    } catch (e) {
      currentPatientMedicalRecords.value = []
      console.error(e)
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  return {
    // state
    appointments,
    appointmentsToday,
    allPatients,
    currentPatientSelectedId,
    currentPatientSelectedData,
    isLoadingPatientsStore,
    isLoadingAppointments,
    isLoadingAppointmentsToday,
    isLoadingAllPatients,
    isLoadingPatientData,
    currentPatientMedicalRecords,
    isLoadingMedicalRecords,
    // actions
    fetchPatientMedicalRecords,
    setPatientsData,
    fetchAppointments,
    fetchAppointmentsToday,
    updateAppointmentStatus,
    fetchAllPatients,
    fetchPatientData,
  }
}, {
  persist: {
    paths: [
      'appointments',
      'appointmentsToday',
      'allPatients',
      'currentPatientSelectedId',
      'currentPatientSelectedData'
    ]
  }
})
