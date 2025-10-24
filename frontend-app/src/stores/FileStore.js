import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { ref } from "vue";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const useFileStore = defineStore(
  "fileStore",
  () => {
    const isLoadingDownload = ref(false);
    const isLoadingUpload = ref(false);
    
    const laboratoryFile = ref(null);
    const laboratoryDescription = ref("");
    const examFile = ref(null);
    const examDescription = ref("");

    const { t } = globalI18n;

    const organizeDocumentsByType = (documents) => {
    if (!documents || typeof documents !== 'object') {
      return {
        laboratories: [],
        exams: [],
        general: [],
        all: []
      };
    }

    const organized = {
      laboratories: [],
      exams: [],
      general: [],
      all: []
    };

    const documentArray = Object.entries(documents).map(([id, doc]) => ({
      id,
      ...doc
    }));

    documentArray.forEach(doc => {
      organized.all.push(doc);

      const type = (doc.type || '').toLowerCase();
      
      if (type.includes('lab') || type.includes('laboratorio')) {
        organized.laboratories.push(doc);
      } else if (type.includes('exam') || type.includes('examen')) {
        organized.exams.push(doc);
      } else {
        organized.general.push(doc);
      }
    });

    return organized;
  };

  const getDocumentTypeLabel = (type) => {
    const typeLower = (type || '').toLowerCase();
    
    if (typeLower.includes('lab') || typeLower.includes('laboratorio')) {
      return t('files.laboratory');
    } else if (typeLower.includes('exam') || typeLower.includes('examen')) {
      return t('files.exam');
    } else if (typeLower.includes('document') || typeLower.includes('documento')) {
      return t('files.document');
    }
    
    return type || t('files.general-document');
  };

  const getDocumentTypeColor = (type) => {
    const typeLower = (type || '').toLowerCase();
    
    if (typeLower.includes('lab') || typeLower.includes('laboratorio')) {
      return '#e74c3c'; 
    } else if (typeLower.includes('exam') || typeLower.includes('examen')) {
      return '#f39c12';
    } else if (typeLower.includes('document') || typeLower.includes('documento')) {
      return '#3498db'; 
    }
    
    return '#95a5a6'; 
  };

  const getDocumentTypeIcon = (type) => {
    const typeLower = (type || '').toLowerCase();
    
    if (typeLower.includes('lab') || typeLower.includes('laboratorio')) {
      return 'BeakerIcon';
    } else if (typeLower.includes('exam') || typeLower.includes('examen')) {
      return 'ClipboardDocumentCheckIcon';
    } else if (typeLower.includes('document') || typeLower.includes('documento')) {
      return 'DocumentTextIcon';
    }
    
    return 'DocumentIcon';
  };

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
        formData.append("File", file);
        formData.append("Type", type);
        formData.append("PatientId", patientId);
        formData.append("Description", description || "");
        
        if (medicalRecordID) {
          formData.append("MedicalRecordID", medicalRecordID);
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

    function viewFile(fileUrl) {
      window.open(fileUrl, '_blank');
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
      organizeDocumentsByType,
      getDocumentTypeLabel,
      getDocumentTypeColor,
      getDocumentTypeIcon,
      uploadFile,
      downloadFile,
      setLaboratoryFile,
      setExamFile,
      clearLaboratoryFile,
      clearExamFile,
      clearAllFiles,
      viewFile
    };
  },
  {
    persist: false,
  },
);
