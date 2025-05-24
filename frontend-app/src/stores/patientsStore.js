import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePatientsStore = defineStore('patients', () => {
     const appointments = ref([])
     const allPatients = ref([])
     const currentPatientSelectedId = ref(undefined)
     const currentPatientSelectedData = ref(undefined)

     const isLoadingPatientsStore = ref(false)
     const isLoadingAppointments = ref(false)
     const isLoadingAllPatients = ref(false)
     const isLoadingPatientData = ref(false)

     function setPatientsData(id){
          currentPatientSelectedId.value = id
          fetchPatientData()
     }

     async function fetchAppointments() {
          try {
               isLoadingAppointments.value = true
               const res = await fetch('http://localhost:9000/appointments')
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
               allPatients.value = await res.json()
          } catch (error) {
               console.error('Error al obtener pacientes:', error)
          } finally {
               isLoadingAllPatients.value = false
          }
     }

     async function fetchPatientData() {
          try {
               isLoadingPatientData.value = true
               const res = await fetch('http://localhost:9000/patients/' + currentPatientSelectedId)
               currentPatientSelectedData.value = await res.json()
          } catch (error) {
               console.error('Error al obtener data del paciente:', error)
          } finally {
               isLoadingPatientData.value = false
          }
     }


     return {
          appointments, isLoadingPatientsStore, isLoadingAppointments, isLoadingAllPatients, isLoadingPatientData,
          allPatients, currentPatientSelectedId, currentPatientSelectedData,
          fetchAppointments, fetchAllPatients, fetchPatientData,
     }
}, {
     persist: {
          paths: ['appointments', 'allPatients', 'currentPatientSelectedId', 'currentPatientSelectedData']
     }
})

