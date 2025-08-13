import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsLogicStore = defineStore('patientsLogic', () => {
     const showDataSheetPatientDialog = ref(false)
     const showCreateNewPatientRecordDialog = ref(false)
     const showViewPatientRecordDialog = ref(false)
     const showEditPatientRecordDialog = ref(false)
     const showDownloadPatientRecordDialog = ref(false)
     const showCreateFormDialog = ref(false)
     const showDetailsModal = ref(false)
     const showFormModal = ref(false)
     const isEditing = ref(false)

     const selectedRecord = ref(null)
     const selectedRecordForEdit = ref(null)
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
     function closeHistoryLogModals() {
        showDetailsModal.value = false
        selectedRecord.value = null
        showFormModal.value = false
        selectedRecordForEdit.value = null
        isEditing.value = false
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
          selectedRecord,
          selectedRecordForEdit,
          isEditing,
          fullRecord,
          openDataSheetPatientDialog,
          openCreateNewPatientRecordDialog,
          openViewPatientRecordDialog,
          openEditPatientRecordDialog,
          openDownloadPatientRecordDialog,
          openCreateFormDialog,
          openRecordDetailsDialog,
          openCreateModal,
          closeAllPatientDialog,
          closeHistoryLogModals,
     }
}, {
     persist: false
})
