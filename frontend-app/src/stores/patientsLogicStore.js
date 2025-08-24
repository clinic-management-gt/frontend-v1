import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePatientsStore } from './patientsStore.js'
import { useNotificationStore } from './notificationStore.js'

export const usePatientsLogicStore = defineStore('patientsLogic', () => {
     const showDataSheetPatientDialog = ref(false)
     const showCreateNewPatientRecordDialog = ref(false)
     const showViewPatientRecordDialog = ref(false)
     const showEditPatientRecordDialog = ref(false)
     const showDownloadPatientRecordDialog = ref(false)
     const showCreateFormDialog = ref(false)
     const showDetailsModal = ref(false)
     const showFormModal = ref(false)
     const showRecipeFormModal = ref(false)
     const isEditing = ref(false)
     const isEditingRecipe = ref(false)

     const selectedRecord = ref(null)
     const selectedRecordForEdit = ref(null)
     const selectedRecipeForEdit = ref(null)
     const fullRecord = ref(null)


     function openDataSheetPatientDialog() {
          showDataSheetPatientDialog.value = true
     }
     function openCreateNewPatientRecordDialog() {
          showCreateNewPatientRecordDialog.value = true
     }
     function openViewPatientRecordDialog() {
          showViewPatientRecordDialog.value = true
     }
     function openEditPatientRecordDialog() {
          showEditPatientRecordDialog.value = true
     }
     function openDownloadPatientRecordDialog() {
          showDownloadPatientRecordDialog.value = true
     }
     function openCreateFormDialog() {
          showCreateFormDialog.value = true
     }
     function openRecordDetailsDialog(record) {
          selectedRecord.value = record
          showDetailsModal.value = true
     }
     function openCreateModal() {
        selectedRecordForEdit.value = null
        isEditing.value = false
        showFormModal.value = true
     }
     
     function openMedicalRecordEditModal(record) {
        selectedRecordForEdit.value = record
        isEditing.value = true
        showFormModal.value = true
        console.log('📋 Estados del modal:', {
          showFormModal: showFormModal.value,
          isEditing: isEditing.value,
          selectedRecordForEdit: selectedRecordForEdit.value
        })
     }

     function openRecipeFormModal(recipe = null) {
        selectedRecipeForEdit.value = recipe
        isEditingRecipe.value = !!recipe
        showRecipeFormModal.value = true
     }

     function closeHistoryLogModals() {
        showDetailsModal.value = false
        selectedRecord.value = null
        showFormModal.value = false
        selectedRecordForEdit.value = null
        isEditing.value = false
        showRecipeFormModal.value = false
        selectedRecipeForEdit.value = null
        isEditingRecipe.value = false
     }

     async function handleMedicalRecordSave(formData, patientId) {
        try {
          console.log('💾 Guardando registro médico...')

          const patientsStore = usePatientsStore()

          // Verificar si viene en el nuevo formato (con medicalRecord y recipe separados)
          const isNewFormat = formData.medicalRecord || formData.recipe
          
          if (isNewFormat) {
            // NUEVO FORMATO: Manejar medical record y recipe por separado
            
            // 1. Manejar Medical Record
            if (formData.medicalRecord) {
              if (isEditing.value && selectedRecordForEdit.value) {
                // Obtener el ID correcto del medical record
                const recordId = selectedRecordForEdit.value.medicalRecord?.id || selectedRecordForEdit.value.id
                await patientsStore.updateMedicalRecord(recordId, formData.medicalRecord)
              } else {
                await patientsStore.createMedicalRecord(patientId, formData.medicalRecord)
              }
            }
            
            // 2. Manejar Recipe si existe
            if (formData.recipe) {
              console.log('💊 Procesando receta médica...')
              // Aquí agregamos lógica para recipes cuando esté lista
            }
            
          } else {
            // FORMATO ACTUAL: Mantener compatibilidad
            
            if (isEditing.value && selectedRecordForEdit.value) {
              // Obtener el ID correcto del medical record
              const recordId = selectedRecordForEdit.value.medicalRecord?.id || selectedRecordForEdit.value.id
              await patientsStore.updateMedicalRecord(recordId, formData)
            } else {
              await patientsStore.createMedicalRecord(patientId, formData)
            }
          }

          console.log('✅ Registro guardado exitosamente')
          
          // Cerrar modal y recargar datos
          closeHistoryLogModals()
          await patientsStore.fetchPatientMedicalRecords(patientId)

          // Usar notification store en lugar de alert
          const notificationStore = useNotificationStore()
          notificationStore.addNotification(
            'success', 
            'general.success', 
            isEditing.value ? 'general.record-updated-successfully' : 'general.record-created-successfully'
          )
          
        } catch (error) {
          console.error('❌ Error al guardar registro:', error)
          
          // Usar notification store en lugar de alert
          const notificationStore = useNotificationStore()
          notificationStore.addNotification(
            'error', 
            'general.error', 
            'Error al guardar el registro: ' + (error.message || 'Error desconocido')
          )
        }
     }

     async function handleRecipeSave(recipeData, patientId) {
        try {
          console.log('💊 Guardando receta:', recipeData)
          console.log('👤 Patient ID:', patientId)
          
          const patientsStore = usePatientsStore()
          const notificationStore = useNotificationStore()
          
          if (isEditingRecipe.value && selectedRecipeForEdit.value) {
            console.log('✏️ Actualizando receta ID:', selectedRecipeForEdit.value.id)
            await patientsStore.updateRecipe(selectedRecipeForEdit.value.id, recipeData)
            notificationStore.addNotification('success', 'general.success', 'Receta actualizada correctamente')
          } else {
            console.log('➕ Creando nueva receta')
            await patientsStore.createRecipe(recipeData)
            notificationStore.addNotification('success', 'general.success', 'Receta creada correctamente')
          }
          
          // Cerrar modal y recargar datos
          closeHistoryLogModals()
          
          // Recargar los detalles del medical record si hay uno seleccionado
          if (selectedRecord.value?.id) {
            await patientsStore.fetchMedicalRecordDetails(selectedRecord.value.id)
          }
          
          // También recargar la lista de medical records del paciente
          if (patientId) {
            await patientsStore.fetchPatientMedicalRecords(patientId)
          }
          
        } catch (error) {
          console.error('❌ Error al guardar receta:', error)
          const notificationStore = useNotificationStore()
          notificationStore.addNotification('error', 'general.error', 'Error al guardar la receta: ' + (error.message || 'Error desconocido'))
        }
     }
     function closeAllPatientDialog() {
          showCreateFormDialog.value = false
          showDataSheetPatientDialog.value = false
          showCreateNewPatientRecordDialog.value = false
          showViewPatientRecordDialog.value = false
          showEditPatientRecordDialog.value = false
          showDownloadPatientRecordDialog.value = false
     }

     return {
          showDataSheetPatientDialog,
          showCreateNewPatientRecordDialog,
          showViewPatientRecordDialog,
          showEditPatientRecordDialog,
          showDownloadPatientRecordDialog,
          showCreateFormDialog,
          showFormModal,
          showDetailsModal,
          showRecipeFormModal,
          selectedRecord,
          selectedRecordForEdit,
          selectedRecipeForEdit,
          isEditing,
          isEditingRecipe,
          fullRecord,
          openDataSheetPatientDialog,
          openCreateNewPatientRecordDialog,
          openViewPatientRecordDialog,
          openEditPatientRecordDialog,
          openDownloadPatientRecordDialog,
          openCreateFormDialog,
          openRecordDetailsDialog,
          openCreateModal,
          openMedicalRecordEditModal,
          openRecipeFormModal,
          closeAllPatientDialog,
          closeHistoryLogModals,
          handleMedicalRecordSave,
          handleRecipeSave,
     }
}, {
     persist: false
})
