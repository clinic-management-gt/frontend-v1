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
    const newPatientData = ref([]);
    const fullRecord = ref([]);
    const currentPatientSelectedId = ref(null);
    const currentPatientSelectedData = ref(null);

    const isLoadingPatientsStore = ref(false);
    const isLoadingAppointments = ref(false);
    const isLoadingAppointmentsToday = ref(false);
    const isLoadingAllPatients = ref(false);
    const isLoadingPatientData = ref(false);
    const isLoadingCreateNewPatient = ref(false);

    const currentPatientMedicalRecords = ref(undefined);
    const isLoadingMedicalRecords = ref(false);
    const hasError = ref(false);

    function setPatientsData(id) {
      currentPatientSelectedId.value = id;
      fetchPatientData();
      fetchPatientMedicalRecords();
    }

    async function createNewPatient(data){
      isLoadingCreateNewPatient.value = true;
      try {
        const formData = new FormData();
        formData.append("Name", data.Name)
        formData.append("LastName", data.LastName)
        formData.append("Birthdate", data.Birthdate)
        formData.append("Gender", data.Gender)
        formData.append("Address", data.Address)
        formData.append("Alergies", data.Alergies)
        formData.append("Syndromes", data.Syndromes)
        formData.append("Pediatrician", data.Pediatrician)
        formData.append("Contacts", data.Contacts)
        formData.append("InsuranceId", data.Insurance)
        formData.append("InfoSheetFile", data.File)
        formData.append("BloodTypeId", data.BloodTypeId)
        formData.append("PatientTypeId", data.PatientTypeId)
        console.log("formData", formData)
        const res = await instance.post("/patients", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        fetchAllPatients();
        return res.data;
      } finally {
        isLoadingCreateNewPatient.value = false;
      }
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

    // patientsStore.js
    async function updateAppointmentStatus(id, newStatus) {
      isLoadingAppointmentsToday.value = true;
      try {
        await instance.patch(`/appointments/${id}`, {
          status: newStatus,
        });
        const idx = appointmentsToday.value.findIndex((a) => a.id === id);
        if (idx !== -1) {
          appointmentsToday.value[idx].status = newStatus;
        }
        return true;
      } finally {
        isLoadingAppointmentsToday.value = false;
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

    async function fetchPatientData() {
      isLoadingPatientData.value = true;
      if (!currentPatientSelectedId.value) {
        return;
      }
      try {
        const res = await instance.get(
          `/patients/${currentPatientSelectedId.value}`,
        );
        currentPatientSelectedData.value = res.data;
      } finally {
        isLoadingPatientData.value = false;
      }
    }

    // Busca la función fetchPatientMedicalRecords y modifícala para manejar mejor el error 404
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
        // Asegurar que el PatientId esté en los datos (backend espera PascalCase)
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
        
        // Mostrar notificación de éxito usando i18n
        notificationStore.addNotification(
          "success",
          "notifications.success",
          globalI18n.t("notifications.medical-record-deleted-successfully")
        );
        
        return true;
      } catch {
        // El manejo de errores se hace en el backend
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
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function fetchRecipe(recipeId) {
      isLoadingMedicalRecords.value = true;
      try {
        const res = await instance.get(`/recipes/${recipeId}`);
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function updateRecipe(recipeId, recipeData) {
      isLoadingMedicalRecords.value = true;
      try {
        const res = await instance.patch(`/recipes/${recipeId}`, recipeData);
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function createRecipe(recipeData) {
      isLoadingMedicalRecords.value = true;
      try {
        const res = await instance.post(`/recipes`, recipeData);
        return res.data;
      } finally {
        isLoadingMedicalRecords.value = false;
      }
    }

    async function createBasicPatient(patientData) {
      isLoadingAllPatients.value = true;
      try {
        const res = await instance.post(`/patients/basic`, patientData);
        // Actualizar la lista de pacientes para incluir el nuevo
        await fetchAllPatients();
        return res.data;
      } finally {
        isLoadingAllPatients.value = false;
      }
    }

    async function createAppointment(appointmentData) {
      isLoadingAppointments.value = true;
      try {
        const res = await instance.post(`/appointments`, appointmentData);
        // Recargar las citas para reflejar el cambio
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
      currentPatientSelectedId,
      currentPatientSelectedData,
      isLoadingPatientsStore,
      isLoadingAppointments,
      isLoadingAppointmentsToday,
      isLoadingAllPatients,
      isLoadingPatientData,
      isLoadingCreateNewPatient,
      currentPatientMedicalRecords,
      isLoadingMedicalRecords,
      hasError,
      // actions
      createNewPatient,
      fetchPatientMedicalRecords,
      setPatientsData,
      fetchAppointments,
      fetchAppointmentsToday,
      updateAppointmentStatus,
      fetchAllPatients,
      fetchPatientData,
      createMedicalRecord,
      updateMedicalRecord,
      deleteMedicalRecord,
      fetchMedicalRecordDetails,
      fetchRecipe,
      updateRecipe,
      createRecipe,
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
        "currentPatientSelectedId",
        "currentPatientSelectedData",
        "newPatientData",
      ],
    },
  },
);
