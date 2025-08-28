<script setup>
import { defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@stores/notificationStore";

const XCircleIcon = defineAsyncComponent(() =>
  import("@heroicons/vue/24/outline/XCircleIcon")
);
const ArrowLeftStartOnRectangleIcon = defineAsyncComponent(() =>
  import("@heroicons/vue/24/outline/ArrowLeftStartOnRectangleIcon")
);
const CheckCircleIcon = defineAsyncComponent(() =>
  import("@heroicons/vue/24/outline/CheckCircleIcon")
);
const ExclamationTriangleIcon = defineAsyncComponent(() =>
  import("@heroicons/vue/24/outline/ExclamationTriangleIcon")
);
const Spinner = defineAsyncComponent(() =>
  import("../forms/SpinnerLoading.vue")
);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
const { t } = useI18n();

// 1) Config centralizada por tipo
const STYLES = {
  success: {
    icon: CheckCircleIcon,
    iconClass: "text-green-400",
    text: { primary: "text-green-800", second: "text-green-700" },
    card: "border-green-400 bg-green-50",
    button: "text-green-400",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconClass: "text-yellow-500",
    text: { primary: "text-yellow-800", second: "text-yellow-700" },
    card: "border-yellow-400 bg-yellow-50",
    button: "text-yellow-500",
  },
  error: {
    icon: XCircleIcon,
    iconClass: "text-red-400",
    text: { primary: "text-red-800", second: "text-red-700" },
    card: "border-red-400 bg-red-50",
    button: "text-red-400",
  },
  loading: {
    icon: Spinner,
    iconClass: "",
    text: { primary: "text-blue-800", second: "text-blue-700" },
    card: "border-blue-400 bg-blue-50",
  },
  logout: {
    icon: ArrowLeftStartOnRectangleIcon,
    iconClass: "text-blue-400",
    text: { primary: "text-blue-800", second: "text-blue-700" },
    card: "border-blue-400 bg-blue-50",
    button: "text-blue-400",
  },
};

// 2) Helper con fallback
const styleFor = (type) => STYLES[type] ?? STYLES.error;
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="assertive"
      class="fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[9999] pointer-events-none"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <transition
          v-for="(n, index) in notifications"
          :key="index"
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="n.visible"
            :class="[
              'pointer-events-auto cursor-default w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
              styleFor(n.type).card,
            ]"
            @mouseenter="notificationStore.startHovering(n.id)"
            @mouseleave="notificationStore.stopHovering(n.id)"
          >
            <div class="p-4">
              <div class="flex items-start">
                <component
                  :is="styleFor(n.type).icon"
                  :class="['h-8 w-8', styleFor(n.type).iconClass]"
                  aria-hidden="true"
                />
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p
                    class="text-sm font-medium"
                    :class="styleFor(n.type).text.primary"
                  >
                    {{ t(n.statusTitle) }}
                  </p>
                  <p
                    v-if="n.statusMessage !== undefined"
                    class="mt-1 text-sm"
                    :class="styleFor(n.type).text.second"
                  >
                    {{ t(n.statusMessage) }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="notificationStore.hideNotification(n.id)"
                  class="ml-4 shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon
                    :class="['h-5 w-5', 'flex-none', styleFor(n.type).button]"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>
