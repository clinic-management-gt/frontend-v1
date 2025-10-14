import { ref } from "vue";
import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const useMedicalRecordStore = defineStore("medicalRecord", () => {
    const medicalRecords = ref([]);
    const selectedRecord = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Recipe related functions
    async function fetchRecipe(recipeId) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.get(`/recipes/${recipeId}`);
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createRecipe(recipeData) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.post(`/recipes`, recipeData);
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateRecipe(recipeId, recipeData) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.patch(`/recipes/${recipeId}`, recipeData);
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteRecipe(recipeId) {
        const notificationStore = useNotificationStore();
        loading.value = true;
        error.value = null;
        
        try {
            await instance.delete(`/recipes/${recipeId}`);
            
            notificationStore.addNotification(
                "success",
                "notifications.success",
                globalI18n.t("notifications.recipe-deleted-successfully")
            );
            
            return true;
        } catch (err) {
            error.value = err.message;
            throw new Error(globalI18n.t("notifications.error-deleting-recipe"));
        } finally {
            loading.value = false;
        }
    }

    // Medical Record CRUD functions
    async function fetchMedicalRecords(patientId) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.get(`/medical-records/patient/${patientId}`);
            medicalRecords.value = res.data;
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchMedicalRecordById(recordId) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.get(`/medical-records/${recordId}`);
            selectedRecord.value = res.data;
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createMedicalRecord(patientId, recordData) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.post(
                `/medical-records/${patientId}`,
                recordData
            );
            
            // Agregar el nuevo registro a la lista
            if (res.data) {
                medicalRecords.value.push(res.data);
            }
            
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateMedicalRecordById(recordId, recordData) {
        loading.value = true;
        error.value = null;
        try {
            const res = await instance.patch(
                `/medical-records/${recordId}`,
                recordData
            );
            
            // Actualizar el registro en la lista
            const index = medicalRecords.value.findIndex(r => r.id === recordId);
            if (index !== -1 && res.data) {
                medicalRecords.value[index] = { ...medicalRecords.value[index], ...res.data };
            }
            
            return res.data;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteMedicalRecordById(recordId) {
        const notificationStore = useNotificationStore();
        loading.value = true;
        error.value = null;
        
        try {
            await instance.delete(`/medical-records/${recordId}`);
            
            // Eliminar el registro de la lista
            medicalRecords.value = medicalRecords.value.filter(r => r.id !== recordId);
            
            notificationStore.addNotification(
                "success",
                "notifications.success",
                globalI18n.t("notifications.record-deleted-successfully")
            );
            
            return true;
        } catch (err) {
            error.value = err.message;
            notificationStore.addNotification(
                "error",
                "notifications.error",
                globalI18n.t("notifications.error-deleting-record")
            );
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Handle Medical Record Save (Create or Update)
    async function handleMedicalRecordSave(recordData, patientId, isEditing = false, recordId = null) {
        const notificationStore = useNotificationStore();
        
        try {
            let result;

            if (isEditing && recordId) {
                // Actualizar registro existente
                result = await updateMedicalRecordById(recordId, recordData);
                
                notificationStore.addNotification(
                    "success",
                    "notifications.success",
                    globalI18n.t("medical-records.record-updated")
                );
            } else {
                // Crear nuevo registro
                result = await createMedicalRecord(patientId, recordData);
                
                notificationStore.addNotification(
                    "success",
                    "notifications.success",
                    globalI18n.t("medical-records.record-created")
                );
            }

            // Recargar los registros médicos del paciente
            await fetchMedicalRecords(patientId);

            return result;
        } catch (err) {
            error.value = err.message;
            notificationStore.addNotification(
                "error",
                "notifications.error",
                err.message || globalI18n.t("medical-records.error-saving-record")
            );
            throw err;
        }
    }

    // Medical Record state management functions
    function setMedicalRecords(records) {
        medicalRecords.value = records;
    }

    function setSelectedRecord(record) {
        selectedRecord.value = record;
    }

    function addMedicalRecord(record) {
        medicalRecords.value.push(record);
    }

    function updateMedicalRecord(id, updatedRecord) {
        const index = medicalRecords.value.findIndex(r => r.id === id);
        if (index !== -1) {
            medicalRecords.value[index] = { ...medicalRecords.value[index], ...updatedRecord };
        }
    }

    function deleteMedicalRecord(id) {
        medicalRecords.value = medicalRecords.value.filter(r => r.id !== id);
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
        loading.value = false;
        error.value = null;
    }

    return {
        // state
        medicalRecords,
        selectedRecord,
        loading,
        error,
        
        // recipe actions
        fetchRecipe,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        
        // medical record CRUD actions
        fetchMedicalRecords,
        fetchMedicalRecordById,
        createMedicalRecord,
        updateMedicalRecordById,
        deleteMedicalRecordById,
        handleMedicalRecordSave,
        
        // medical record state actions
        setMedicalRecords,
        setSelectedRecord,
        addMedicalRecord,
        updateMedicalRecord,
        deleteMedicalRecord,
        setLoading,
        setError,
        clearError,
        reset,
    };
});