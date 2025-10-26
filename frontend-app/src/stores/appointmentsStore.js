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

    /**
     * Obtener todas las citas
     * @param {Object} filters - Filtros opcionales (date, status, etc.)
     */
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

    /**
     * Obtener una cita por ID
     * @param {number} id - ID de la cita
     */
    async function fetchAppointmentById(id) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        const res = await instance.get(`/appointments/${id}`);
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

    /**
     * Crear una nueva cita
     * @param {Object} appointmentData - Datos de la cita
     */
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

    /**
     * Actualizar una cita existente
     * @param {number} id - ID de la cita
     * @param {Object} appointmentData - Datos actualizados
     */
    async function updateAppointment(id, appointmentData) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        const res = await instance.patch(`/appointments/${id}`, appointmentData);
        
        // Actualizar en la lista local
        const index = appointments.value.findIndex(apt => apt.id === id);
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

    /**
     * Eliminar una cita
     * @param {number} id - ID de la cita
     */
    async function deleteAppointment(id) {
      isLoadingAppointments.value = true;
      error.value = null;
      try {
        await instance.delete(`/appointments/${id}`);
        
        // Eliminar de la lista local
        appointments.value = appointments.value.filter(apt => apt.id !== id);
        
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

    /**
     * Limpiar el error
     */
    function clearError() {
      error.value = null;
    }

    /**
     * Limpiar la cita seleccionada
     */
    function clearSelectedAppointment() {
      selectedAppointment.value = null;
    }

    /**
     * Resetear el store
     */
    function reset() {
      appointments.value = [];
      selectedAppointment.value = null;
      isLoadingAppointments.value = false;
      error.value = null;
    }

    return {
      // State
      appointments,
      selectedAppointment,
      isLoadingAppointments,
      error,

      // Actions
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
