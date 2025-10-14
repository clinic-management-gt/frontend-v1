import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { usePatientsStore } from "./patientsStore.js";
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

    const selectedRecord = ref(null);
    const selectedRecordForEdit = ref(null);
    const selectedRecipeForEdit = ref(null);
    const fullRecord = ref(null);
    const currentMedicalRecordId = ref(null);

    const patientStore = usePatientsStore();
    const { currentPatientSelectedId, currentPatientSelectedData } = storeToRefs(patientStore)

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
      showCreateFormDialog.value = true;
    }
    function openRecordDetailsDialog(record) {
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
      // Extraer el ID correcto del medical record
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

    async function handleRecipeSave(recipeData, patientId) {
      try {
        const patientsStore = usePatientsStore();
        const notificationStore = useNotificationStore();

        if (isEditingRecipe.value && selectedRecipeForEdit.value) {
          await patientsStore.updateRecipe(
            selectedRecipeForEdit.value.id,
            recipeData,
          );
          notificationStore.addNotification(
            "success",
            "general.success",
            "Receta actualizada correctamente",
          );
        } else {
          await patientsStore.createRecipe(recipeData);
          notificationStore.addNotification(
            "success",
            "general.success",
            "Receta creada correctamente",
          );
        }

        closeHistoryLogModals();

        if (selectedRecord.value?.id) {
          await patientsStore.fetchMedicalRecordDetails(
            selectedRecord.value.id,
          );
        }

        if (patientId) {
          await patientsStore.fetchPatientMedicalRecords(patientId);
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
      currentPatientSelectedId.value = id
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
      showFormModal,
      showDetailsModal,
      showRecipeFormModal,
      selectedRecord,
      selectedRecordForEdit,
      selectedRecipeForEdit,
      currentMedicalRecordId,
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
      handleRecipeSave,
      selectPatientById,
      returnToPatientsTable,
    };
  },
  {
    persist: false,
  },
);
