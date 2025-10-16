import { defineStore } from "pinia";
import { ref } from "vue";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const usePatientsStore = defineStore(
  "patients",
  () => {
    const appointments = ref([]);
    const appointmentsToday = ref([]);
    const allPatients = ref([]);
    const pendingPatients = ref([]);
    const newPatientData = ref([]);
    const fullRecord = ref([]);
    const currentPatientSelectedId = ref(null);
    const currentPatientSelectedData = ref(null);

    const isLoadingPatientsStore = ref(false);
    const isLoadingAppointments = ref(false);
    const isLoadingAppointmentsToday = ref(false);
    const isLoadingAllPatients = ref(false);
    const isLoadingPendingPatients = ref(false);
    const isLoadingPatientData = ref(false);

    const currentPatientMedicalRecords = ref(undefined);
    const isLoadingMedicalRecords = ref(false);
    const hasError = ref(false);

    function setPatientsData(id) {
      currentPatientSelectedId.value = id;
      fetchPatientData();
      fetchPatientMedicalRecords();
    }

    async function fetchAppointments() {
      isLoadingAppointments.value = true;
      try {
        const res = await instance.get("/appointments");
        appointments.value = res.data;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    async function fetchAppointmentsToday() {
      isLoadingAppointmentsToday.value = true;
      try {
        const res = await instance.get("/appointments/today");
        appointmentsToday.value = res.data;
      } finally {
        isLoadingAppointmentsToday.value = false;
      }
    }

    async function updateAppointmentStatus(id, newStatus) {
      try {
        // No activamos el loading global para evitar recargar todo el componente
        await instance.patch(`/appointments/${id}`, {
          status: newStatus,
        });
        const idx = appointmentsToday.value.findIndex((a) => a.id === id);
        if (idx !== -1) {
          // Actualizamos solo el estado sin modificar la referencia completa
          appointmentsToday.value[idx].status = newStatus;
        }
        return true;
      } catch (error) {
        console.error("Error al actualizar estado de cita:", error);
        return false;
      }
    }

    async function fetchAllPatients() {
      isLoadingAllPatients.value = true;
      try {
        const res = await instance.get("/patients");
        allPatients.value = res.data;
      } finally {
        isLoadingAllPatients.value = false;
      }
    }

    async function fetchPendingPatients() {
      isLoadingPendingPatients.value = true;
      try {
        const res = await instance.get("/patients/pending");
        pendingPatients.value = res.data.patients;
        return res.data;
      } catch (error) {
        console.error("Error fetching pending patients:", error);
        throw error;
      } finally {
        isLoadingPendingPatients.value = false;
      }
    }

    async function fetchPatientData() {
      isLoadingPatientData.value = true;
      // Usar el ID proporcionado o el guardado en el store
      const id = patientId || currentPatientSelectedId.value;
      if (!id) {
        return null;
      }
      try {
        const res = await instance.get(`/patients/${id}`);
        // Si estamos obteniendo datos para el paciente seleccionado, actualizar el store
        if (id === currentPatientSelectedId.value) {
          currentPatientSelectedData.value = res.data;
        }
        return res.data;
      } finally {
        isLoadingPatientData.value = false;
      }
    }

    async function fetchPatientMedicalRecords(patientId) {
      isLoadingMedicalRecords.value = true;
      patientId = patientId || currentPatientSelectedId.value;
      if (!patientId) return;
      try {
        const res = await instance.get(
          `/patients/${patientId}/medicalrecords?page=1&limit=50`,
        );
        currentPatientMedicalRecords.value = res.data.records || [];
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function createMedicalRecord(patientId, recordData) {
      isLoadingMedicalRecords.value = true;
      try {
        const dataToSend = { ...recordData, PatientId: patientId };
        const res = await instance.post(`/medicalrecords`, dataToSend);
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function updateMedicalRecord(recordId, recordData) {
      isLoadingMedicalRecords.value = true;
      try {
        const res = await instance.patch(
          `/medicalrecords/${recordId}`,
          recordData,
        );
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function deleteMedicalRecord(recordId) {
      const notificationStore = useNotificationStore();
      isLoadingMedicalRecords.value = true;
      
      try {
        await instance.delete(`/medicalrecords/${recordId}`);
        
        notificationStore.addNotification(
          "success",
          "notifications.success",
          globalI18n.t("notifications.medical-record-deleted-successfully")
        );
        
        return true;
      } catch {
        throw new Error(globalI18n.t("notifications.error-deleting-record"));
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function fetchMedicalRecordDetails(recordId) {
      isLoadingMedicalRecords.value = true;
      hasError.value = false;
      try {
        const res = await instance.get(`/medicalrecords/${recordId}/details`);
        fullRecord.value = res.data;
        return res.data; // Devolver los datos para que puedan ser usados directamente
      } catch (error) {
        hasError.value = true;
        throw error;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function uploadFile(
      file,
      type,
      patientId,
      description,
      medicalRecordID,
    ) {
      isLoadingMedicalRecords.value = true;
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
        isLoadingMedicalRecords.value = false;
      }
    }

    async function downloadFile(PatientId, type, MedicalRecordId) {
      const res = await instance.get("/files/download", {
        params: {
          PatientId,
          type,
          MedicalRecordId,
        },
        responseType: "blob",
      });
      return res.data;
    }
    
    async function createBasicPatient(patientData) {
      isLoadingPendingPatients.value = true;
      try {
        const res = await instance.post(`/patients/basic`, patientData);
        // Actualizar la lista de pacientes pendientes
        await fetchPendingPatients();
        return res.data;
      } finally {
        isLoadingPendingPatients.value = false;
      }
    }

    async function createAppointment(appointmentData) {
      isLoadingAppointments.value = true;
      try {
        const res = await instance.post(`/appointments`, appointmentData);
        await fetchAppointments();
        await fetchAppointmentsToday();
        return res.data;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    function clearFullRecord() {
      fullRecord.value = null;
    }

    return {
      // state
      fullRecord,
      newPatientData,
      appointments,
      appointmentsToday,
      allPatients,
      pendingPatients,
      currentPatientSelectedId,
      currentPatientSelectedData,
      isLoadingPatientsStore,
      isLoadingAppointments,
      isLoadingAppointmentsToday,
      isLoadingAllPatients,
      isLoadingPendingPatients,
      isLoadingPatientData,
      currentPatientMedicalRecords,
      isLoadingMedicalRecords,
      hasError,
      // actions
      fetchPatientMedicalRecords,
      setPatientsData,
      fetchAppointments,
      fetchAppointmentsToday,
      updateAppointmentStatus,
      fetchAllPatients,
      fetchPendingPatients,
      fetchPatientData,
      createMedicalRecord,
      updateMedicalRecord,
      deleteMedicalRecord,
      fetchMedicalRecordDetails,
      uploadFile,
      downloadFile,
      createBasicPatient,
      createAppointment,
      clearFullRecord
    };
  },
  {
    persist: {
      paths: [
        "appointments",
        "appointmentsToday",
        "allPatients",
        "pendingPatients",
        "currentPatientSelectedId",
        "currentPatientSelectedData",
        "newPatientData",
      ],
    },
  },
);
