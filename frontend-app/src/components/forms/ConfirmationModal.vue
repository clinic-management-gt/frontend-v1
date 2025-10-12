<template>
  <general-dialog-modal
    :isOpen="isOpen"
    :dialogSize="dialogSize"
    :cancelButton="true"
    @close-modal="handleClose"
  >
    <template #title>
      <div class="flex items-center">
        <component
          :is="iconComponent"
          class="h-6 w-6 mr-2"
          :class="iconClass"
          aria-hidden="true"
        />
        <h3 class="text-lg font-semibold">
          {{ title }}
        </h3>
      </div>
    </template>

    <template #body>
      <p class="text-gray-600 mb-4">
        {{ message }}
      </p>
    </template>

    <template #buttons>
      <button
        type="button"
        class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors mr-3"
        @click="handleClose"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        class="px-4 py-2 text-white rounded-md transition-colors"
        :class="confirmButtonClass"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { computed } from 'vue';
import GeneralDialogModal from '@/components/forms/GeneralDialogModal.vue';

// Importar iconos
import { 
  ExclamationTriangleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline';

// No need for i18n here as we're passing all text via props

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info'
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  dialogSize: {
    type: String,
    default: 'max-w-md'
  }
});

const emit = defineEmits(['close', 'confirm']);

// Definir el ícono y clase según el tipo
const iconComponent = computed(() => {
  switch (props.type) {
    case 'warning':
      return ExclamationTriangleIcon;
    case 'danger':
      return XCircleIcon;
    case 'info':
    default:
      return QuestionMarkCircleIcon;
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'text-yellow-500';
    case 'danger':
      return 'text-red-500';
    case 'info':
    default:
      return 'text-blue-500';
  }
});

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700';
    case 'info':
    default:
      return 'bg-blue-600 hover:bg-blue-700';
  }
});

// Manejar cierre del modal
const handleClose = () => {
  emit('close');
};

// Manejar confirmación
const handleConfirm = () => {
  emit('confirm');
};
</script>
