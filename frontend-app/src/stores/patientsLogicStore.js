import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { usePatientsStore } from "./patientsStore.js";

export const usePatientsLogicStore = defineStore(
  "patientsLogic",
  () => {
    const showDataSheetPatientDialog = ref(false);
    const showCreateNewPatientRecordDialog = ref(false);
    const showViewPatientRecordDialog = ref(false);
    const showEditPatientRecordDialog = ref(false);
    const showDownloadPatientRecordDialog = ref(false);
    const showCreateFormDialog = ref(false);

    const initializeEmptyPatient = () => ({
      Name: "",
      LastName: "",
      Birthdate: "",
      Gender: 1,
      Address: "",
      Alergies: [],
      Syndromes: [],
      Pediatrician: "",
      Contacts: [],
      InsuranceId: null,
      BloodTypeId: [],
      PatientTypeId: [],
      isFormValid: false,
      InfoSheetFile: null,
    });

    const patientStore = usePatientsStore();
    const { currentPatientSelectedId, currentPatientSelectedData } = storeToRefs(patientStore);

    function openDataSheetPatientDialog() {
      showDataSheetPatientDialog.value = true;
    }
    
    function openCreateNewPatientRecordDialog() {
      showCreateNewPatientRecordDialog.value = true;
    }
    
    function openViewPatientRecordDialog() {
      showViewPatientRecordDialog.value = true;
    }
    
    function openEditPatientRecordDialog() {
      showEditPatientRecordDialog.value = true;
    }
    
    function openDownloadPatientRecordDialog() {
      showDownloadPatientRecordDialog.value = true;
    }
    
    function openCreateFormDialog() {
      if (!patientStore.newPatientData) {
        patientStore.newPatientData = initializeEmptyPatient();
      }
      showCreateFormDialog.value = true;
    }

    function closeAllPatientDialog() {
      showCreateFormDialog.value = false;
      showDataSheetPatientDialog.value = false;
      showCreateNewPatientRecordDialog.value = false;
      showViewPatientRecordDialog.value = false;
      showEditPatientRecordDialog.value = false;
      showDownloadPatientRecordDialog.value = false;
    }

    function selectPatientById(id){
      currentPatientSelectedId.value = id;
    }

    function returnToPatientsTable() {
      currentPatientSelectedId.value = null;
      currentPatientSelectedData.value = null;
    }

    return {
      showDataSheetPatientDialog,
      showCreateNewPatientRecordDialog,
      showViewPatientRecordDialog,
      showEditPatientRecordDialog,
      showDownloadPatientRecordDialog,
      showCreateFormDialog,
      openDataSheetPatientDialog,
      openCreateNewPatientRecordDialog,
      openViewPatientRecordDialog,
      openEditPatientRecordDialog,
      openDownloadPatientRecordDialog,
      openCreateFormDialog,
      closeAllPatientDialog,
      selectPatientById,
      returnToPatientsTable,
    };
  },
  {
    persist: false,
  },
);
