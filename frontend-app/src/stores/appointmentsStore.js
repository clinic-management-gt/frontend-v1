import { ref } from "vue";
import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { globalI18n } from "@/langs/index.js";

export const useAppointmentsStore = defineStore(
  "appointments",
  () => {
    const appointments = ref([]);
    const selectedAppointment = ref(null);
    const isLoadingAppointments = ref(false);
    const error = ref(null);

    const { t } = globalI18n;
    const notificationStore = useNotificationStore();

    async function fetchAppointments(filters = {}) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        let url = '/appointments';
        const queryParams = [];
        
        if (filters.date) {
          queryParams.push(`date=${encodeURIComponent(filters.date)}`);
        }
        if (filters.status) {
          queryParams.push(`status=${encodeURIComponent(filters.status)}`);
        }

        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        const res = await instance.get(url);
        appointments.value = res.data || [];
        return res.data;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("appointments.error-fetching-appointments")
        );
        throw err;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    async function fetchAppointmentById(appointmentId) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        const res = await instance.get(`/appointments/${appointmentId}`);
        selectedAppointment.value = res.data;
        return res.data;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("appointments.error-fetching-appointment")
        );
        throw err;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    async function createAppointment(appointmentData) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        const res = await instance.post('/appointments', appointmentData);
        
        if (res.data) {
          appointments.value.push(res.data);
        }
        
        notificationStore.addNotification(
          "success",
          t("notifications.success"),
          t("appointments.appointment-created")
        );
        
        return res.data;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("appointments.error-creating-appointment")
        );
        throw err;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    async function updateAppointment(appointmentId, appointmentData) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        const res = await instance.patch(`/appointments/${appointmentId}`, appointmentData);
        
        const index = appointments.value.findIndex(apt => apt.id === appointmentId);
        if (index !== -1 && res.data) {
          appointments.value[index] = { ...appointments.value[index], ...res.data };
        }
        
        notificationStore.addNotification(
          "success",
          t("notifications.success"),
          t("appointments.appointment-updated")
        );
        
        return res.data;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("appointments.error-updating-appointment")
        );
        throw err;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    async function deleteAppointment(appointmentId) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        await instance.delete(`/appointments/${appointmentId}`);
        
        appointments.value = appointments.value.filter(apt => apt.id !== appointmentId);
        
        notificationStore.addNotification(
          "success",
          t("notifications.success"),
          t("appointments.appointment-deleted")
        );
        
        return true;
      } catch (err) {
        error.value = err.message;
        notificationStore.addNotification(
          "error",
          t("general.error"),
          t("appointments.error-deleting-appointment")
        );
        throw err;
      } finally {
        isLoadingAppointments.value = false;
      }
    }

    function clearError() {
      error.value = null;
    }

    function clearSelectedAppointment() {
      selectedAppointment.value = null;
    }

    function reset() {
      appointments.value = [];
      selectedAppointment.value = null;
      isLoadingAppointments.value = false;
      error.value = null;
    }

    return {
      appointments,
      selectedAppointment,
      isLoadingAppointments,
      error,
      fetchAppointments,
      fetchAppointmentById,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      clearError,
      clearSelectedAppointment,
      reset,
    };
  },
  {
    persist: false,
  }
);
