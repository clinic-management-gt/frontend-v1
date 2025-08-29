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
  const hasError = ref(false)

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
      console.log(`➕ Creando medical record para paciente ${patientId} con datos:`, recordData)
      // Asegurar que el PatientId esté en los datos (backend espera PascalCase)
      const dataToSend = { ...recordData, PatientId: patientId }
      const res = await instance.post(`/medicalrecords`, dataToSend)
      console.log('✅ Medical record creado:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Error en createMedicalRecord:', error.response?.data || error.message)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  async function updateMedicalRecord(recordId, recordData) {
    isLoadingMedicalRecords.value = true
    try {
      console.log(`🔄 Actualizando medical record ${recordId} con datos:`, recordData)
      console.log('🔍 URL de la petición:', `/medicalrecords/${recordId}`)
      console.log('🔍 Tipo de petición: PATCH')
      const res = await instance.patch(`/medicalrecords/${recordId}`, recordData)
      console.log('✅ Respuesta del servidor:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Error en updateMedicalRecord:', error.response?.data || error.message)
      console.error('❌ Status del error:', error.response?.status)
      console.error('❌ Config de axios:', error.config)
      if (error.response?.data?.errors) {
        console.error('❌ Validation errors detallados:', error.response.data.errors)
      }
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }


  async function deleteMedicalRecord(recordId) {
    isLoadingMedicalRecords.value = true
    try {
      console.log(`🗑️ Eliminando medical record ${recordId}`)
      await instance.delete(`/medicalrecords/${recordId}`)
      console.log('✅ Medical record eliminado')
      return true
    } catch (error) {
      console.error('❌ Error en deleteMedicalRecord:', error.response?.data || error.message)
      throw error
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function fetchMedicalRecordDetails(recordId) {
    isLoadingMedicalRecords.value = true
    hasError.value = false
    try {
      const res = await instance.get(`/medicalrecords/${recordId}/details`)
      fullRecord.value = res.data
    } catch (error) {
      console.error('Error fetching medical record details:', error)
      hasError.value = true
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function uploadFile(file, patientId) {
    isLoadingMedicalRecords.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await instance.post(`/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

  // === FUNCIONES PARA RECETAS ===
  async function fetchRecipe(recipeId) {
    isLoadingMedicalRecords.value = true
    try {
      const res = await instance.get(`/recipes/${recipeId}`)
      return res.data
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function updateRecipe(recipeId, recipeData) {
    isLoadingMedicalRecords.value = true
    try {
      const res = await instance.patch(`/recipes/${recipeId}`, recipeData)
      return res.data
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  async function createRecipe(recipeData) {
    isLoadingMedicalRecords.value = true
    try {
      const res = await instance.post(`/recipes`, recipeData)
      return res.data
    } finally {
      isLoadingMedicalRecords.value = false
    }
  }

  function clearFullRecord() {
    fullRecord.value = null
  }

  function clearFullRecord() {
    fullRecord.value = null
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
    hasError,
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
    uploadFile,
    // recipe actions
    fetchRecipe,
    updateRecipe,
    createRecipe,
    clearFullRecord,
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

