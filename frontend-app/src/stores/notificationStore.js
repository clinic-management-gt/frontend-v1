import { defineStore } from "pinia";
import { ref } from "vue";
import { DateTime } from "luxon";

export const useNotificationStore = defineStore(
  "notificationStore",
  () => {
    const notifications = ref([]);

    const isLoadingNotificationStore = ref(false);

    function addNotification(type, statusTitle, statusMessage) {
      const id = DateTime.now();
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
      const notification = notifications.value.find(({ id }) => id === id);
      if (notification) {
        notification.timeoutId = timeoutId;
      }
      console.log(notifications.value);
    }

    function hideNotification(id) {
      const notification = notifications.value.find(({ id }) => id === id);
      const index = notifications.value.indexOf(notification);
      if (notification) {
        notification.visible = false;
        notifications.value.splice(index, 1);
      }
    }

    function startHovering(notificationId) {
      const notification = notifications.value.find(
        (n) => n.id === notificationId
      );
      if (notification && notification.timeoutId) {
        clearTimeout(notification.timeoutId);
        notification.timeoutId = null;
      }
    }

    function stopHovering(notificationId) {
      const notification = notifications.value.find(
        (n) => n.id === notificationId
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
  }
);
