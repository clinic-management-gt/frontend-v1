<template>
     <div>
          <transition-root as="template" :show="props.isOpen">
               <Dialog class="relative z-40" @close="closeModal">
                    <transition-child as="template" enter="ease-out duration-300" enter-from="opacity-0"
                         enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100"
                         leave-to="opacity-0">
                         <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
                    </transition-child>

                    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                         <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                              <transition-child as="template" enter="ease-out duration-300"
                                   enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                   enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                                   leave-from="opacity-100 translate-y-0 sm:scale-100"
                                   leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                   <dialog-panel
                                        class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                             <button type="button"
                                                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                                                  @click="closeModal">
                                                  <span class="sr-only">Close</span>
                                                  <XMarkIcon class="size-6" aria-hidden="true" />
                                             </button>
                                        </div>
                                        <div class="sm:flex sm:items-start">
                                             <div
                                                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                  <ExclamationTriangleIcon class="size-6 text-red-600"
                                                       aria-hidden="true" />
                                             </div>
                                             <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                  <dialog-title as="h3" class="text-base font-semibold text-gray-900">
                                                       <slot name="title"></slot>
                                                  </dialog-title>
                                                  <slot name="body" class="mt-2"> </slot>
                                             </div>
                                        </div>
                                        <div class="mt-5 sm:mt-4 sm:flex">
                                             <primary-button bgColor="white" @click="closeModal">
                                                  <p class="uppercase">
                                                       {{ $t('general.cancel') }}
                                                  </p>
                                             </primary-button>
                                             <slot name="button"></slot>
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
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import PrimaryButton from '@components/forms/PrimaryButton.vue'

const emit = defineEmits(['closeModal'])
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false
     },
     dialogSize: {
          type: String,
          default: "max-w-md"
     },
     cancelButton: {
          type: Boolean,
          default: false,
     },
})
const closeModal = () => {
     if (!props.isChildrenOpen) {
          emit('closeModal', false)
     }
}

</script>