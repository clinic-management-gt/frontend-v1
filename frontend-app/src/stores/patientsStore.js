import { defineStore } from 'pinia'
import { ref } from 'vue'
import instance from '@stores/axios.js'

export const usePatientsStore = defineStore('patients', () => {
  const appointments = ref([])
  const appointmentsToday = ref([])
  const allPatients = ref([])
  const newPatientData = ref([])
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
      const res = await instance.get('/appointments')
      appointments.value = res.data
    } catch (error) {
      console.error('Error al obtener citas:', error)
    } finally {
      isLoadingAppointments.value = false
    }
  }

  async function fetchAppointmentsToday() {
    try {
      isLoadingAppointmentsToday.value = true
      const res = await  instance.get('/appointments/today')
      appointmentsToday.value = res.data
    } catch (error) {
      console.error('Error al obtener citas de hoy:', error)
    } finally {
      isLoadingAppointmentsToday.value = false
    }

  }

  // patientsStore.js
  async function updateAppointmentStatus(id, newStatus) {
    try {
      const res = await instance.patch(`/appointments/${id}`, {
        status: newStatus
      })

      const idx = appointmentsToday.value.findIndex(a => a.id === id);
      if (idx !== -1) {
        appointmentsToday.value[idx].status = newStatus;
      }

      return true
    } catch (e) {
      console.error('Error al actualizar estado de cita:', e)
      return false
    }
  }

  async function fetchAllPatients() {
    isLoadingAllPatients.value = true
    try {
      const res = await instance.get('/patients')
      allPatients.value = res.data
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
      const res = await instance.get(`/patients/${currentPatientSelectedId.value}`)
      currentPatientSelectedData.value = res.data
      console.log("DANG", currentPatientSelectedData.value)
    } catch (error) {
      console.error('Error al obtener data del paciente:', error)
    } finally {
      isLoadingPatientData.value = false
    }
  }

  // Busca la función fetchPatientMedicalRecords y modifícala para manejar mejor el error 404
  async function fetchPatientMedicalRecords(patientId) {
    patientId = patientId || currentPatientSelectedId.value;
    if (!patientId) return;

    isLoadingMedicalRecords.value = true;

    try {
      const res = await instance.get(`/patients/${patientId}/medicalrecords?page=1&limit=50`)
      currentPatientMedicalRecords.value = res.data.records || []
      console.log('Registros médicos cargados:', currentPatientMedicalRecords.value)
      return res.data
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`No hay registros médicos para el paciente ${patientId}`)
        currentPatientMedicalRecords.value = []
        return
      }
      console.error('Error al obtener registros médicos:', error)
      currentPatientMedicalRecords.value = []
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function createMedicalRecord(patientId, recordData) {
    isLoadingMedicalRecords.value = true
    try {
      console.log('Creando registro médico:', { patientId, recordData })
      const res = await instance.post(`/patients/${patientId}/medicalrecords`, recordData)
      return res.data
    } catch (error) {
      console.error('Error al crear registro médico:', error)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  async function updateMedicalRecord(recordId, recordData) {
    isLoadingMedicalRecords.value = true
    try {
      const patientId = currentPatientSelectedId.value || 1
      const res = await instance.patch(`/patients/${patientId}/medicalrecords/${recordId}`, recordData)
      return res.data
    } catch (error) {
      console.error('Error al actualizar registro médico:', error)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  async function deleteMedicalRecord(recordId) {
    isLoadingMedicalRecords.value = true
    try {
      const patientId = currentPatientSelectedId.value || 1
      await instance.delete(`/patients/${patientId}/medicalrecords/${recordId}`)
      return true
    } catch (error) {
      console.error('Error al eliminar registro médico:', error)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function fetchMedicalRecordDetails(recordId) {
    isLoadingMedicalRecords.value = false
    try {
      const res = await instance.get(`/medicalrecords/${recordId}/details`)
      return res.data
    } catch (error) {
      console.error('Error al obtener detalles del registro médico:', error)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  return {
    // state
    newPatientData,
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
    isLoadingMedicalRecords,
    // actions
    fetchPatientMedicalRecords,
    setPatientsData,
    fetchAppointments,
    fetchAppointmentsToday,
    updateAppointmentStatus,
    fetchAllPatients,
    fetchPatientData,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    fetchMedicalRecordDetails,
  }
}, {
  persist: {
    paths: [
      'appointments',
      'appointmentsToday',
      'allPatients',
      'currentPatientSelectedId',
      'currentPatientSelectedData',
      'newPatientData'
    ]
  }
})

