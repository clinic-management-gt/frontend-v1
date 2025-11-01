<script setup>
import { computed } from 'vue';
import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue';
import PrimaryButton from '@components/forms/PrimaryButton.vue';
import { useAppointmentsStore } from '@/stores/appointmentsStore';
import { useI18n } from 'vue-i18n';

const appointmentsStore = useAppointmentsStore();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  patientData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'confirm']);

const { t } = useI18n();

const patientName = computed(() => {
  return props.patientData?.patientData?.name || props.patientData?.patientName || '';
});

const patientId = computed(() => {
    console.log('patientData prop:', props.patientData);
  return props.patientData?.patientData?.id || props.patientData?.patientId || null;
});

function handleClose() {
  emit('close');
}

function handleConfirm() {
  emit('confirm');
}
</script>

<template>
  <general-dialog-modal
    :isOpen="isOpen"
    dialogSize="max-w-md"
    :cancelButton="false"
    @close-modal="handleClose"
  >
    <template #title>
      <p class="text-xl font-semibold text-gray-900">{{ t('calendar.delete-event-title') }}</p>
    </template>

    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ t('calendar.delete-event-message') }}
        </p>
        <p class="text-lg font-semibold text-gray-900">
          {{ patientName }}
        </p>
      </div>
    </template>

    <template #buttons>
        <primary-button
          bgColor="red"
          @click="handleConfirm"
        >
          <p class="uppercase">{{ t('general.delete') }}</p>
        </primary-button>
    </template>
  </general-dialog-modal>
</template>
