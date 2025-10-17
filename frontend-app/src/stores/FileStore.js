import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { ref } from "vue";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const useFileStore = defineStore(
  "fileStore",
  () => {
    const isLoadingDownload = ref(false);
    const isLoadingUpload = ref(false);
    
    // Estado de archivos seleccionados
    const laboratoryFile = ref(null);
    const laboratoryDescription = ref("");
    const examFile = ref(null);
    const examDescription = ref("");

    async function downloadFile(PatientId, type, MedicalRecordId) {
      try {
        isLoadingDownload.value = true;
        const res = await instance.get("/files/download", {
          params: {
            PatientId,
            type,
            MedicalRecordId,
          },
          responseType: "blob",
        });
        return res.data;
      } catch (error) {
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(
          "error",
          "notifications.error",
          globalI18n.t("files.error-downloading-file"),
        );
        throw error;
      } finally {
        isLoadingDownload.value = false;
      }
    }

    async function uploadFile(
      file,
      type,
      patientId,
      description,
      medicalRecordID,
    ) {
      try {
        isLoadingUpload.value = true;
        const notificationStore = useNotificationStore();

        // Validar tamaño del archivo (10MB máximo)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          notificationStore.addNotification(
            "warning",
            "general.warning",
            globalI18n.t("files.file-too-large", { maxSize: 10 }),
          );
          return null;
        }

        // Crear FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("patientId", patientId);
        formData.append("description", description || "");
        
        if (medicalRecordID) {
          formData.append("medicalRecordID", medicalRecordID);
        }

        // Subir archivo
        const res = await instance.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        notificationStore.addNotification(
          "success",
          "notifications.success",
          globalI18n.t("files.file-uploaded-successfully"),
        );

        return res.data;
      } catch (error) {
        const notificationStore = useNotificationStore();
        notificationStore.addNotification(
          "error",
          "notifications.error",
          globalI18n.t("files.error-uploading-file"),
        );
        throw error;
      } finally {
        isLoadingUpload.value = false;
      }
    }

    function setLaboratoryFile(file) {
      if (file) {
        // Validar tamaño
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(
            "warning",
            "general.warning",
            globalI18n.t("files.file-too-large", { maxSize: 10 }),
          );
          return false;
        }
        laboratoryFile.value = file;
        return true;
      }
      return false;
    }

    function setExamFile(file) {
      if (file) {
        // Validar tamaño
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          const notificationStore = useNotificationStore();
          notificationStore.addNotification(
            "warning",
            "general.warning",
            globalI18n.t("files.file-too-large", { maxSize: 10 }),
          );
          return false;
        }
        examFile.value = file;
        return true;
      }
      return false;
    }

    function clearLaboratoryFile() {
      laboratoryFile.value = null;
      laboratoryDescription.value = "";
    }

    function clearExamFile() {
      examFile.value = null;
      examDescription.value = "";
    }

    function clearAllFiles() {
      clearLaboratoryFile();
      clearExamFile();
    }

    return {
      // state
      isLoadingDownload,
      isLoadingUpload,
      laboratoryFile,
      laboratoryDescription,
      examFile,
      examDescription,
      
      // actions
      uploadFile,
      downloadFile,
      setLaboratoryFile,
      setExamFile,
      clearLaboratoryFile,
      clearExamFile,
      clearAllFiles,
    };
  },
  {
    persist: false,
  },
);
