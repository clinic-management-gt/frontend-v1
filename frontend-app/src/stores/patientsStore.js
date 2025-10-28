import { defineStore } from "pinia";
import { ref } from "vue";
import instance from "@stores/axios.js";

export const usePatientsStore = defineStore(
  "patients",
  () => {
    const appointments = ref([]);
    const appointmentsToday = ref([]);
    const allPatients = ref([]);
    const pendingPatients = ref([]);
    const newPatientData = ref([]);
    const currentPatientSelectedId = ref(null);
    const currentPatientSelectedData = ref(null);

    const isLoadingPatientsStore = ref(false);
    const isLoadingAppointments = ref(false);
    const isLoadingAppointmentsToday = ref(false);
    const isLoadingAllPatients = ref(false);
    const isLoadingPendingPatients = ref(false);
    const isLoadingPatientData = ref(false);
    const isLoadingCreateNewPatient = ref(false);

    function setPatientsData(id) {
      currentPatientSelectedId.value = id;
      fetchPatientData(id);
    }

    async function createNewPatient(data){
      isLoadingCreateNewPatient.value = true;
      try {
        const formData = new FormData();
        formData.append("Name", data.Name);
        formData.append("LastName", data.LastName);
        formData.append("Birthdate", data.Birthdate);
        formData.append("Gender", data.Gender);
        formData.append("Address", data.Address);
        formData.append("Alergies", data.Alergies);
        formData.append("Syndromes", data.Syndromes);
        formData.append("Pediatrician", data.Pediatrician);
        formData.append("Contacts", data.Contacts);
        formData.append("InsuranceId", data.Insurance);
        formData.append("InfoSheetFile", data.File);
        formData.append("BloodTypeId", data.BloodTypeId);
        formData.append("PatientTypeId", data.PatientTypeId);
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

    async function updateAppointmentStatus(id, newStatus) {
      try {
        await instance.patch(`/appointments/${id}`, {
          status: newStatus,
        });
        const idx = appointmentsToday.value.findIndex((a) => a.id === id);
        if (idx !== -1) {
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

    async function fetchPatientData(patientId) {
      isLoadingPatientData.value = true;
      const id = patientId.value || currentPatientSelectedId.value;
      if (!id) {
        return null;
      }
      try {
        const res = await instance.get(`/patients/${id}`);
        if (id === currentPatientSelectedId.value) {
          currentPatientSelectedData.value = res.data;
        }
        return res.data;
      } finally {
        isLoadingPatientData.value = false;
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
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
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
    
    async function createPendingPatient(patientData) {
      isLoadingPendingPatients.value = true;
      try {
        const res = await instance.post(`/patients/pending`, patientData);
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

    return {
      // state
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
      isLoadingCreateNewPatient,
      // actions
      createNewPatient,
      setPatientsData,
      fetchAppointments,
      fetchAppointmentsToday,
      updateAppointmentStatus,
      fetchAllPatients,
      fetchPendingPatients,
      fetchPatientData,
      uploadFile,
      downloadFile,
      createPendingPatient,
      createAppointment,
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
