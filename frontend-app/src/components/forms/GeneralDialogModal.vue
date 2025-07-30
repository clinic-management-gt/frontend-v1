<template>
  <transition-root appear :show="props.isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <transition-child as="template" enter="duration-300 ease-out" enter-from="opacity-0"
        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      </transition-child>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <transition-child as="template" enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <dialog-panel
              :class="['w-full transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all', customWidth || dialogSize]">
              
              <!-- Header del modal -->
              <div class="bg-gray-100 px-6 py-4 border-b rounded-t-2xl">
                <div class="flex justify-between items-center">
                  <dialog-title class="text-xl font-bold text-gray-800">
                    {{ title }}
                  </dialog-title>
                  <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Cuerpo del modal -->
              <div class="p-6">
                <slot></slot>
              </div>

              <!-- Footer del modal (si showConfirm es true) -->
              <div v-if="showConfirm" class="mt-4 flex justify-end border-t pt-4">
                <primary-button class="mr-2" type="button" bg-color="white" @click="closeModal">
                  <p class="uppercase">{{ $t('general.cancel') }}</p>
                </primary-button>
                <slot name="buttons"></slot>
              </div>
            </dialog-panel>
          </transition-child>
        </div>
      </div>
    </Dialog>
  </transition-root>
</template>

<script setup>
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import { TransitionRoot, TransitionChild, Dialog, DialogTitle, DialogPanel } from '@headlessui/vue'

const emit = defineEmits(['close'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  dialogSize: {
    type: String,
    default: "max-w-md"
  },
  customWidth: {
    type: String,
    default: ''
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  isChildrenOpen: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  if (!props.isChildrenOpen) {
    emit('close')
  }
}

defineExpose({ closeModal })
</script>