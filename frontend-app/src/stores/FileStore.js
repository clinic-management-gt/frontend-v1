import { defineStore } from "pinia";
import { ref } from "vue";

export const useFileStore = defineStore(
  "fileStore",
  () => {
    const isLoadingDownload = ref(false);
    const isLoadingUpload = ref(false);

    async function downloadFile(PatientId, type, MedicalRecordId) {
        try {
            isLoadingDownload.value = true
            const res = await instance.get("/files/download", {
            params: {
              PatientId,
              type,
              MedicalRecordId,
            },
                responseType: "blob",
            });
            return res.data;
        } finally {
            isLoadingDownload.value = false
        }
    }

    async function uploadFile(
      file,
      type,
      patientId,
      description,
      medicalRecordID,
    ) {
      isLoadingUpload.value = true;
      try {
        const formData = new FormData();
        formData.append("patientId", patientId);
        formData.append("type", type);
        formData.append("descripcion", description);
        formData.append("file", file);
        formData.append("medicalRecordID", medicalRecordID);

        const res = await instance.post(`/files/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return res.data;
      } finally {
        isLoadingUpload.value = false;
      }
    }

    return {
      isLoadingDownload,
      isLoadingUpload,
      uploadFile,
      downloadFile,
    };
  },
  {
    persist: false,
  },
);
