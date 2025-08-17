import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePatientsStore } from './patientsStore.js'

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
          console.log('💾 Guardando registro:', formData)
          console.log('🔍 Estado isEditing:', isEditing.value)
          console.log('👤 Patient ID:', patientId)

          const patientsStore = usePatientsStore()

          // Verificar si viene en el nuevo formato (con medicalRecord y recipe separados)
          const isNewFormat = formData.medicalRecord || formData.recipe
          
          if (isNewFormat) {
            // NUEVO FORMATO: Manejar medical record y recipe por separado
            console.log('📋 Usando nuevo formato unificado')
            
            // 1. Manejar Medical Record
            if (formData.medicalRecord) {
              if (isEditing.value && selectedRecordForEdit.value) {
                console.log('✏️ Actualizando medical record ID:', selectedRecordForEdit.value.id)
                await patientsStore.updateMedicalRecord(selectedRecordForEdit.value.id, formData.medicalRecord)
              } else {
                console.log('➕ Creando nuevo medical record para paciente:', patientId)
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
            console.log('📋 Usando formato actual (solo medical record)')
            
            if (isEditing.value && selectedRecordForEdit.value) {
              console.log('✏️ Actualizando registro ID:', selectedRecordForEdit.value.id)
              await patientsStore.updateMedicalRecord(selectedRecordForEdit.value.id, formData)
            } else {
              console.log('➕ Creando nuevo registro para paciente:', patientId)
              await patientsStore.createMedicalRecord(patientId, formData)
            }
          }

          console.log('✅ Registro guardado exitosamente')
          
          // Cerrar modal y recargar datos
          closeHistoryLogModals()
          await patientsStore.fetchPatientMedicalRecords(patientId)

          alert(isEditing.value ? 'Registro actualizado correctamente' : 'Registro creado correctamente')
          
        } catch (error) {
          console.error('❌ Error al guardar registro:', error)
          console.error('📋 Detalles del error:', error.response?.data || error.message)
          alert('Error al guardar el registro: ' + (error.message || 'Error desconocido'))
        }
     }

     async function handleRecipeSave(recipeData, patientId) {
        try {
          console.log('💊 Guardando receta:', recipeData)
          
          const patientsStore = usePatientsStore()
          
          if (isEditingRecipe.value && selectedRecipeForEdit.value) {
            await patientsStore.updateRecipe(selectedRecipeForEdit.value.id, recipeData)
            alert('Receta actualizada correctamente')
          } else {
            await patientsStore.createRecipe(recipeData)
            alert('Receta creada correctamente')
          }
          
          // Cerrar modal y recargar datos
          closeHistoryLogModals()
          await patientsStore.fetchPatientMedicalRecords(patientId)
          
        } catch (error) {
          console.error('❌ Error al guardar receta:', error)
          alert('Error al guardar la receta: ' + (error.message || 'Error desconocido'))
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
