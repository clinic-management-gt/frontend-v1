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

    // ✅ Función auxiliar para inicializar paciente vacío
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
    const fullRecord = ref(null);

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
      const patientsStore = usePatientsStore();

      if (!patientsStore.newPatientData) {
        patientsStore.newPatientData = initializeEmptyPatient();
      }
      
      showCreateFormDialog.value = true;
    }
    function openRecordDetailsDialog(record) {
      selectedRecord.value = record;
      showDetailsModal.value = true;
    }
    function openCreateModal() {
      selectedRecordForEdit.value = null;
      isEditing.value = false;
      showFormModal.value = true;
    }

    function openMedicalRecordEditModal(record) {
      selectedRecordForEdit.value = record;
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
      isEditing.value = false;
      showRecipeFormModal.value = false;
      selectedRecipeForEdit.value = null;
      isEditingRecipe.value = false;
    }

    async function handleMedicalRecordSave(formData, patientId) {
      try {
        const patientsStore = usePatientsStore();

        // Verificar si viene en el nuevo formato (con medicalRecord y recipe separados)
        const isNewFormat = formData.medicalRecord || formData.recipe;

        if (isNewFormat) {
          // NUEVO FORMATO: Manejar medical record y recipe por separado

          // 1. Manejar Medical Record
          if (formData.medicalRecord) {
            if (isEditing.value && selectedRecordForEdit.value) {
              // Obtener el ID correcto del medical record
              const recordId =
                selectedRecordForEdit.value.medicalRecord?.id ||
                selectedRecordForEdit.value.id;
              await patientsStore.updateMedicalRecord(
                recordId,
                formData.medicalRecord,
              );
            } else {
              await patientsStore.createMedicalRecord(
                patientId,
                formData.medicalRecord,
              );
            }
          }

          // 2. Manejar Recipe si existe
          if (formData.recipe) {
            // Aquí agregamos lógica para recipes cuando esté lista
          }
        } else {
          // FORMATO ACTUAL: Mantener compatibilidad

          if (isEditing.value && selectedRecordForEdit.value) {
            // Obtener el ID correcto del medical record
            const recordId =
              selectedRecordForEdit.value.medicalRecord?.id ||
              selectedRecordForEdit.value.id;
            await patientsStore.updateMedicalRecord(recordId, formData);
          } else {
            await patientsStore.createMedicalRecord(patientId, formData);
          }
        }

        // Cerrar modal y recargar datos
        closeHistoryLogModals();
        await patientsStore.fetchPatientMedicalRecords(patientId);

        // Usar notification store en lugar de alert
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(
          "success",
          "general.success",
          isEditing.value
            ? "general.record-updated-successfully"
            : "general.record-created-successfully",
        );
      } catch (error) {
        // Usar notification store en lugar de alert
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

        // Cerrar modal y recargar datos
        closeHistoryLogModals();

        // Recargar los detalles del medical record si hay uno seleccionado
        if (selectedRecord.value?.id) {
          await patientsStore.fetchMedicalRecordDetails(
            selectedRecord.value.id,
          );
        }

        // También recargar la lista de medical records del paciente
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
      showDetailsModal,
      showFormModal,
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
      selectPatientById,
      returnToPatientsTable,
    };
  },
  {
    persist: false,
  },
);
