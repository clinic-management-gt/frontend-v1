import { defineStore } from 'pinia'
import { ref } from 'vue'
import instance from '@stores/axios.js'

export const usePatientsStore = defineStore('patients', () => {
  const appointments = ref([])
  const appointmentsToday = ref([])
  const allPatients = ref([])
  const newPatientData = ref([])
  const fullRecord = ref([])
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
    isLoadingAppointments.value = true
    try {
      const res = await instance.get('/appointments')
      appointments.value = res.data
    } finally {
      isLoadingAppointments.value = false
    }
  }

  async function fetchAppointmentsToday() {
    isLoadingAppointmentsToday.value = true
    try {
      const res = await  instance.get('/appointments/today')
      appointmentsToday.value = res.data
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
    } finally {
      isLoadingAllPatients.value = false
    }
  }

  async function fetchPatientData() {
    isLoadingPatientData.value = true
    if (!currentPatientSelectedId.value) {
      console.warn('ID de paciente no definido')
      return
    }
    try {
      const res = await instance.get(`/patients/${currentPatientSelectedId.value}`)
      currentPatientSelectedData.value = res.data
    } finally {
      isLoadingPatientData.value = false
    }
  }

  // Busca la función fetchPatientMedicalRecords y modifícala para manejar mejor el error 404
  async function fetchPatientMedicalRecords(patientId) {
    isLoadingMedicalRecords.value = true;
    patientId = patientId || currentPatientSelectedId.value;
    if (!patientId) return;
    try {
      const res = await instance.get(`/patients/${patientId}/medicalrecords?page=1&limit=50`)
      currentPatientMedicalRecords.value = res.data.records || []
      return res.data
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function createMedicalRecord(patientId, recordData) {
    isLoadingMedicalRecords.value = true
    try {
      const res = await instance.post(`/patients/${patientId}/medicalrecords`, recordData)
      return res.data
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
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function fetchMedicalRecordDetails(recordId) {
    isLoadingMedicalRecords.value = false
    try {
      const res = await instance.get(`/medicalrecords/${recordId}/details`)
      fullRecord.value = res.data
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  return {
    // state
    fullRecord,
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

