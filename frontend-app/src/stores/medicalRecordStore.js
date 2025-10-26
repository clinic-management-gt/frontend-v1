import { ref } from "vue";
import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const useMedicalRecordStore = defineStore(
  "medicalRecord",
  () => {
    const medicalRecords = ref([]);
    const selectedRecord = ref(null);
    const fullRecord = ref(null);
    const currentPatientMedicalRecords = ref(null);
    const selectedRecordForEdit = ref(null);
    const currentMedicalRecordId = ref(null);
    const error = ref(null);
    const hasError = ref(false);

    const loading = ref(false);
    const isLoadingMedicalRecords = ref(false);
    const isLoadingMedicalRecordSave = ref(false);
    const isEditing = ref(false);
    const showFormModal = ref(false);
    const showDetailsModal = ref(false);

    const { t } = globalI18n;

    const notificationStore = useNotificationStore();

    // Medical Record CRUD functions
    async function fetchMedicalRecords(patientId) {
      isLoadingMedicalRecords.value = true;
      error.value = null;
      try {
        const res = await instance.get(`/patients/${patientId}/medicalrecords`);
        medicalRecords.value = res.data;
        return res.data;
      } catch (err) {
        error.value = err.message;
        throw err;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function fetchPatientMedicalRecords(patientId) {
      isLoadingMedicalRecords.value = true;
      if (!patientId) return;
      try {
        const res = await instance.get(
          `/patients/${patientId}/medicalrecords?page=1&limit=50`
        );
        currentPatientMedicalRecords.value = res.data.records || [];
        return res.data;
      } catch (err) {
        error.value = err.message;
        throw err;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function fetchFirstMedicalRecord(patientId) {
      isLoadingMedicalRecords.value = true;
      if (!patientId) return null;
      
      try {
        const res = await instance.get(
          `/patients/${patientId}/medicalrecords?page=1&limit=1&offset=0`
        );
        
        const records = res.data?.records;
        
        if (records && records.length > 0) {
          // Ordenar por fecha de creación (más antigua primero) y retornar el primero
          const sortedRecords = [...records].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );
          return sortedRecords[0];
        }
        
        return null;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("patients.error-loading-medical-record")
        );
        return null;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function fetchMedicalRecordById(recordId) {
      try {
        loading.value = true;
        error.value = null;
        const res = await instance.get(`/medicalrecords/${recordId}`);
        selectedRecord.value = res.data;
        return res.data;
      } finally {
        loading.value = false;
      }
    }

    async function fetchMedicalRecordDetails(recordId) {
      try {
        isLoadingMedicalRecords.value = true;
        hasError.value = false;
        const res = await instance.get(`/medicalrecords/${recordId}/details`);
        fullRecord.value = res.data;
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function createMedicalRecord(patientId, recordData) {
      try {
        isLoadingMedicalRecords.value = true;
        error.value = null;
        const dataToSend = { ...recordData, PatientId: patientId };
        const res = await instance.post(`/medicalrecords`, dataToSend);
        if (res.data) {
          medicalRecords.value.push(res.data);
        }
        notificationStore.addNotification(
          "success",
          "notifications.success",
          t("medical-records.record-created")
        );
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function updateMedicalRecordById(recordId, recordData) {
      try {
        isLoadingMedicalRecords.value = true;
        error.value = null;
        const res = await instance.patch(
          `/medicalrecords/${recordId}`,
          recordData
        );
        notificationStore.addNotification(
          "success",
          "notifications.success",
          t("medical-records.record-updated")
        );

        // Actualizar el registro en la lista
        const index = medicalRecords.value.findIndex((r) => r.id === recordId);
        if (index !== -1 && res.data) {
          medicalRecords.value[index] = {
            ...medicalRecords.value[index],
            ...res.data,
          };
        }

        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function deleteMedicalRecordById(recordId) {
      try {
        isLoadingMedicalRecords.value = true;
        error.value = null;
        await instance.delete(`/medicalrecords/${recordId}`);

        // Eliminar el registro de la lista
        medicalRecords.value = medicalRecords.value.filter(
          (r) => r.id !== recordId
        );

        notificationStore.addNotification(
          "success",
          "notifications.success",
          t("notifications.medical-record-deleted-successfully")
        );

        return true;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    // UI Modal functions
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
      currentMedicalRecordId.value = record.medicalRecord?.id || record.id;
      isEditing.value = true;
      showFormModal.value = true;
    }

    function closeMedicalRecordModals() {
      showDetailsModal.value = false;
      showFormModal.value = false;
      selectedRecord.value = null;
      selectedRecordForEdit.value = null;
      currentMedicalRecordId.value = null;
      isEditing.value = false;
    }

    function setMedicalRecords(records) {
      medicalRecords.value = records;
    }

    function setSelectedRecord(record) {
      selectedRecord.value = record;
    }

    function setSelectedRecordForEdit(record) {
      selectedRecordForEdit.value = record;
    }

    function addMedicalRecord(record) {
      medicalRecords.value.push(record);
    }

    function updateMedicalRecord(id, updatedRecord) {
      const index = medicalRecords.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        medicalRecords.value[index] = {
          ...medicalRecords.value[index],
          ...updatedRecord,
        };
      }
    }

    function clearFullRecord() {
      fullRecord.value = null;
    }

    function clearSelectedRecord() {
      selectedRecord.value = null;
    }

    function setLoading(value) {
      loading.value = value;
    }

    function setError(err) {
      error.value = err;
    }

    function clearError() {
      error.value = null;
    }

    function reset() {
      medicalRecords.value = [];
      selectedRecord.value = null;
      fullRecord.value = null;
      currentPatientMedicalRecords.value = undefined;
      selectedRecordForEdit.value = null;
      currentMedicalRecordId.value = null;
      loading.value = false;
      isLoadingMedicalRecords.value = false;
      isEditing.value = false;
      showFormModal.value = false;
      showDetailsModal.value = false;
      error.value = null;
      hasError.value = false;
    }

    return {
      // state
      medicalRecords,
      selectedRecord,
      fullRecord,
      currentPatientMedicalRecords,
      selectedRecordForEdit,
      currentMedicalRecordId,
      loading,
      isLoadingMedicalRecords,
      isLoadingMedicalRecordSave,
      isEditing,
      showFormModal,
      showDetailsModal,
      error,
      hasError,

      // medical record CRUD actions
      fetchMedicalRecords,
      fetchPatientMedicalRecords,
      fetchFirstMedicalRecord,
      fetchMedicalRecordById,
      fetchMedicalRecordDetails,
      createMedicalRecord,
      updateMedicalRecordById,
      deleteMedicalRecordById,

      // UI modal actions
      openRecordDetailsDialog,
      openCreateModal,
      openMedicalRecordEditModal,
      closeMedicalRecordModals,

      // medical record state actions
      setMedicalRecords,
      setSelectedRecord,
      setSelectedRecordForEdit,
      addMedicalRecord,
      updateMedicalRecord,
      clearFullRecord,
      clearSelectedRecord,
      setLoading,
      setError,
      clearError,
      reset,
    };
  },
  {
    persist: false,
  }
);