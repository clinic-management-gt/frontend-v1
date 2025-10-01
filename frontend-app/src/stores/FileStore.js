import { defineStore } from "pinia";
import { ref } from "vue";

export const useFileStore = defineStore(
  "fileStore",
  () => {
    const isLoadingDownload = ref(false);
    const isLoadingUpload = ref(false);

    function downloadFile() {
        try {
            isLoadingDownload.value = true
            console.log("Download")
        } finally {
            isLoadingDownload.value = false
        }
    }

    function uploadFile() {
        try {
            isLoadingUpload.value = true
        } finally {
            isLoadingUpload.value = false
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
