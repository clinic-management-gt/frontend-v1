<template>
  <div>
    <transition-root
      appear
      :show="props.isOpen"
      as="template"
    >
      <Dialog
        as="div"
        class="relative z-50"
        @close="closeModal"
      >
        <transition-child
          as="template"
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 pointer-events-none"></div>
        </transition-child>

        <div class="fixed inset-0 overflow-y-auto pointer-events-none">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center pointer-events-auto"
          >
            <transition-child
              as="template"
              enter="duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <dialog-panel
                :class="[
                  'w-full transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                  props.dialogSize,
                ]"
              >
                <dialog-title class="mb-2">
                  <slot name="title">
                  </slot>
                </dialog-title>
                <slot name="body">
                </slot>
                <div class="mt-2 flex justify-end">
                  <primary-button
                    v-if="cancelButton === false"
                    class="mr-2"
                    type="button"
                    bgColor="white"
                    @click="closeModal"
                  >
                    <p class="uppercase">
                      {{ $t("general.cancel") }}
                    </p>
                  </primary-button>
                  <slot name="buttons">
                  </slot>
                </div>
              </dialog-panel>
            </transition-child>
          </div>
        </div>
      </Dialog>
    </transition-root>
  </div>
</template>

<script setup>
import PrimaryButton from "@/components/forms/PrimaryButton.vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogTitle,
  DialogPanel
} from "@headlessui/vue";

const emit = defineEmits(["closeModal"]);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  dialogSize: {
    type: String,
    default: "max-w-md",
  },
  cancelButton: {
    type: Boolean,
    default: false,
  },
  isChildrenOpen: {
    type: Boolean,
    default: false,
  },
});

const closeModal = () => {
  if (!props.isChildrenOpen) {
    emit("closeModal", false);
  }
};

defineExpose({ closeModal });
</script>
