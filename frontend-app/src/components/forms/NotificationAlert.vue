<template>
  <Teleport to="body">
    <div aria-live="assertive"
      class="fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[9999] pointer-events-none">
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <transition v-for="(notification, index) in notifications" :key="index"
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="notification.visible"
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div class="p-4">
              <div class="flex items-start">
                <component :is="getIcon(notification.type)"
                  :class="['h-8 w-8 text-gray-400', iconColor(notification.type)]" aria-hidden="true" />
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">
                    {{ t(notification.statusTitle) }}
                  </p>
                  <p v-if="notification.statusMessage !== undefined" class="mt-1 text-sm text-gray-500">
                    {{ t(notification.statusMessage) }}
                  </p>
                </div>
                <button type="button" class="ml-4 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                  @click="notificationStore.hideNotification(notification.id)">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@stores/notificationStore";

const XCircleIcon = defineAsyncComponent(() => import("@heroicons/vue/24/outline/XCircleIcon"));
const ArrowLeftStartOnRectangleIcon = defineAsyncComponent(() => import("@heroicons/vue/24/outline/ArrowLeftStartOnRectangleIcon"));
const CheckCircleIcon = defineAsyncComponent(() => import("@heroicons/vue/24/outline/CheckCircleIcon"));
const ExclamationTriangleIcon = defineAsyncComponent(() => import("@heroicons/vue/24/outline/ExclamationTriangleIcon"));
const Spinner = defineAsyncComponent(() => import("../forms/SpinnerLoading.vue"));

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

const { t } = useI18n();

const onMouseOver = (notificationId) => {
  notificationStore.startHovering(notificationId)
}

const onMouseLeave = (notificationId) => {
  notificationStore.stopHovering(notificationId)
}

const getIcon = (type) => {
  if (type == "success") {
    return CheckCircleIcon;
  } else if (type == "warning") {
    return ExclamationTriangleIcon;
  } else if (type == 'loading') {
    return Spinner;
  } else if (type == 'logout') {
    return ArrowLeftStartOnRectangleIcon
  } else if (type == 'error') {
    return XCircleIcon;
  }
};

const iconColor = (type) => {
  switch (type) {
    case "success":
      return "text-green-400";
    case "warning":
      return "text-yellow-500";
    case "logout":
      return "text-red-400"
    case "loading":
      return ""
    default:
      return "text-red-400";
  }
};
</script>
