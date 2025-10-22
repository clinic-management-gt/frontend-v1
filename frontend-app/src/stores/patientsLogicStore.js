import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { usePatientsStore } from "./patientsStore.js";
import { useMedicalRecordStore } from "./medicalRecordStore.js";
import { useNotificationStore } from "./notificationStore.js";

export const usePatientsLogicStore = defineStore(
  "patientsLogic",
  () => {
    const showDataSheetPatientDialog = ref(false);
    const showCreateNewPatientRecordDialog = ref(false);
    const showViewPatientRecordDialog = ref(false);
    const showEditPatientRecordDialog = ref(false);
    const showDownloadPatientRecordDialog = ref(false);
    const showCreateFormDialog = ref(false);
    const showDetailsModal = ref(false);
    const showFormModal = ref(false);
    const showRecipeFormModal = ref(false);
    const isEditing = ref(false);
    const isEditingRecipe = ref(false);

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

    const selectedRecord = ref(null);
    const selectedRecordForEdit = ref(null);
    const selectedRecipeForEdit = ref(null);
    const currentMedicalRecordId = ref(null);

    const patientStore = usePatientsStore();
    const medicalRecordStore = useMedicalRecordStore();
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
    function openRecordDetailsDialog(record) {
      console.log("Abriendo detalles para el registro:", record);
      selectedRecord.value = record;
      showDetailsModal.value = true;
    }
    function openCreateModal() {
      selectedRecordForEdit.value = null;
      currentMedicalRecordId.value = null;
      isEditing.value = false;
      showFormModal.value = true;
    }

    function openMedicalRecordEditModal(record) {
      selectedRecordForEdit.value = record;
      currentMedicalRecordId.value = record.medicalRecord?.id || record.id;
      isEditing.value = true;
      showFormModal.value = true;
    }

    function openRecipeFormModal(recipe = null) {
      selectedRecipeForEdit.value = recipe;
      isEditingRecipe.value = !!recipe;
      showRecipeFormModal.value = true;
    }

    function closeHistoryLogModals() {
      showDetailsModal.value = false;
      selectedRecord.value = null;
      showFormModal.value = false;
      selectedRecordForEdit.value = null;
      currentMedicalRecordId.value = null;
      isEditing.value = false;
      showRecipeFormModal.value = false;
      selectedRecipeForEdit.value = null;
      isEditingRecipe.value = false;
    }

    async function handleMedicalRecordSave(formData, patientId) {
      try {
        const notificationStore = useNotificationStore();
        
        const isNewFormat = formData.medicalRecord || formData.recipe;
        let medicalRecordId = null;

        if (isNewFormat) {
          // Manejar Medical Record
          if (formData.medicalRecord) {
            if (isEditing.value && selectedRecordForEdit.value) {
              const recordId =
                selectedRecordForEdit.value.medicalRecord?.id ||
                selectedRecordForEdit.value.id;
              await medicalRecordStore.updateMedicalRecordById(
                recordId,
                formData.medicalRecord,
              );
              medicalRecordId = recordId;
            } else {
              const response = await medicalRecordStore.createMedicalRecord(
                patientId,
                formData.medicalRecord,
              );
              medicalRecordId = response.id;
            }
          }

          // Manejar Recipe si existe
          if (formData.recipe) {
            try {
              let treatmentId = null;
              
              try {
                await patientStore.fetchPatientData(patientId);
                
                if (medicalRecordId) {
                  const details = await medicalRecordStore.fetchMedicalRecordDetails(medicalRecordId);
                  
                  if (details && details.treatments && details.treatments.length > 0) {
                    treatmentId = details.treatments[0].id;
                  }
                }
              } catch {
                // Error silencioso
              }
              
              if (!treatmentId) {
                notificationStore.addNotification(
                  "warning",
                  "recipes.warning",
                  "recipes.warning-no-treatment"
                );
                return;
              }
              
              const recipeData = {
                prescription: formData.recipe.prescription,
                treatmentId: treatmentId
              };
              
              await medicalRecordStore.createRecipe(recipeData);
            } catch {
              notificationStore.addNotification(
                "error",
                "general.error",
                "recipes.error-saving"
              );
            }
          }
        } else {
          // Formato actual
          if (isEditing.value && selectedRecordForEdit.value) {
            const recordId =
              selectedRecordForEdit.value.medicalRecord?.id ||
              selectedRecordForEdit.value.id;
            await medicalRecordStore.updateMedicalRecordById(recordId, formData);
          } else {
            await medicalRecordStore.createMedicalRecord(patientId, formData);
          }
        }

        closeHistoryLogModals();
        await medicalRecordStore.fetchPatientMedicalRecords(patientId);

        let successMessage = isEditing.value
          ? "general.record-updated-successfully"
          : "general.record-created-successfully";
          
        if (formData.recipe) {
          successMessage = "notifications.medical-record-and-recipe-created-successfully";
        }

        notificationStore.addNotification(
          "success",
          "general.success",
          successMessage
        );
      } catch (error) {
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(
          "error",
          "general.error",
          "Error al guardar el registro: " +
            (error.message || "Error desconocido"),
        );
      }
    }

    async function handleRecipeSave(recipeData, patientId) {
      try {
        const notificationStore = useNotificationStore();

        if (isEditingRecipe.value && selectedRecipeForEdit.value) {
          await medicalRecordStore.updateRecipe(
            selectedRecipeForEdit.value.id,
            recipeData,
          );
          notificationStore.addNotification(
            "success",
            "general.success",
            "Receta actualizada correctamente",
          );
        } else {
          await medicalRecordStore.createRecipe(recipeData);
          notificationStore.addNotification(
            "success",
            "general.success",
            "Receta creada correctamente",
          );
        }

        closeHistoryLogModals();

        if (selectedRecord.value?.id) {
          await medicalRecordStore.fetchMedicalRecordDetails(
            selectedRecord.value.id,
          );
        }

        if (patientId) {
          await medicalRecordStore.fetchPatientMedicalRecords(patientId);
        }
      } catch (error) {
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(
          "error",
          "general.error",
          "Error al guardar la receta: " +
            (error.message || "Error desconocido"),
        );
      }
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
      showDetailsModal,
      showFormModal,
      showRecipeFormModal,
      selectedRecord,
      selectedRecordForEdit,
      selectedRecipeForEdit,
      currentMedicalRecordId,
      isEditing,
      isEditingRecipe,
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
      handleRecipeSave,
      selectPatientById,
      returnToPatientsTable,
      handleMedicalRecordSave
    };
  },
  {
    persist: false,
  },
);
