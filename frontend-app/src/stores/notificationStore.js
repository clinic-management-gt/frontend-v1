import { defineStore } from "pinia";
import { ref } from "vue";
import { DateTime } from "luxon";

export const useNotificationStore = defineStore(
  "notificationStore",
  () => {
    const notifications = ref([]);

    const isLoadingNotificationStore = ref(false);

    function addNotification(type, statusTitle, statusMessage) {
      const id = DateTime.now().toMillis();
      notifications.value.push({
        id,
        type,
        statusTitle,
        statusMessage,
        visible: true,
        timeoutId: null,
      });
      const timeoutId = setTimeout(() => {
        hideNotification(id);
      }, 5000);
      const notification = notifications.value.find((n) => n.id === id);
      if (notification) {
        notification.timeoutId = timeoutId;
      }
    }

    function hideNotification(Id) {
      const index = notifications.value.findIndex((n) => n.id === Id);

      if (index !== -1) {
        const notification = notifications.value[index];
        if (notification.timeoutId) {
          clearTimeout(notification.timeoutId);
        }
        notifications.value.splice(index, 1);
      }
    }

    function startHovering(notificationId) {
      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification && notification.timeoutId) {
        clearTimeout(notification.timeoutId);
        notification.timeoutId = null;
      }
    }

    function stopHovering(notificationId) {
      const notification = notifications.value.find(
        (n) => n.id === notificationId,
      );
      if (notification && !notification.timeoutId) {
        const timeoutId = setTimeout(() => {
          hideNotification(notificationId);
        }, 5000);
        notification.timeoutId = timeoutId;
      }
    }

    return {
      notifications,
      isLoadingNotificationStore,
      addNotification,
      hideNotification,
      startHovering,
      stopHovering,
    };
  },
  {
    persist: false,
  },
);
