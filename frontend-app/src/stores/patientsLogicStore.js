import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsLogicStore = defineStore('patientsLogic', () => {
     const showDataSheetPatientDialog = ref(false)
     const showCreateNewPatientRecordDialog = ref(false)
     const showViewPatientRecordDialog = ref(false)
     const showEditPatientRecordDialog = ref(false)
     const showDownloadPatientRecordDialog = ref(false)

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
     function closeAllPatientDialog() {
          showDataSheetPatientDialog.value = false
          showCreateNewPatientRecordDialog.value = false
          showViewPatientRecordDialog.value = false
          showEditPatientRecordDialog.value = false
          showDownloadPatientRecordDialog.value = false
     }

     return {
          showDataSheetPatientDialog, showCreateNewPatientRecordDialog, showViewPatientRecordDialog, showEditPatientRecordDialog, showDownloadPatientRecordDialog,
          openDataSheetPatientDialog, openCreateNewPatientRecordDialog, openViewPatientRecordDialog, openEditPatientRecordDialog, openDownloadPatientRecordDialog, closeAllPatientDialog
     }
}, {
     persist: false
})
