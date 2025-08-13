<template>
  <general-dialog-modal :is-open="isOpen"   dialogSize="max-w-4xl" @close-modal="handleClose">
    <template #title>
      <p class="text-xl">
        {{ isEditing ? 'Editar registro médico' : 'Agregar registro médico' }}
      </p>
    </template>
    <template #body>
      <div class="space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Formulario principal -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Información básica -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Información básica</h3>

            <!-- Peso y Altura -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <custom-label title="Peso (kg)" />
                <text-input v-model="formData.weight" type="number" step="0.1" placeholder="70.5" />
              </div>
              <div>
                <custom-label title="Altura (cm)" />
                <text-input v-model="formData.height" type="number" step="0.1" placeholder="175.2" />
              </div>
            </div>

            <!-- Antecedentes familiares -->
            <div class="mb-4">
              <custom-label title="Antecedentes familiares" />
              <textarea v-model="formData.familyHistory" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="3" placeholder="Antecedentes familiares del paciente..."></textarea>
            </div>

            <!-- Notas de evolución -->
            <div>
              <custom-label title="Notas de evolución" />
              <textarea v-model="formData.notes" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="4" placeholder="Notas de evolución del paciente..."></textarea>
            </div>
          </div>
        </form>
      </div>
    </template>

    <!-- Botones de acción -->
    <template #buttons>
      <primary-button v-if="isLoading" :disabled="isLoading">
        <span  class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Guardando...
        </span>
      </primary-button>
      <primary-button :disabled="isLoading">
        <p class="uppercase">
          {{ $t(isEditing ? 'general.update' : 'general.save') }}
        </p>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'

import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import CustomLabel from '@components/forms/CustomLabel.vue'
import TextInput from '@components/forms/TextInput.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  patientId: {
    type: [String, Number],
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const patientsLogicStore = usePatientsLogicStore()
const { selectedRecordForEdit, isEditing } = storeToRefs(patientsLogicStore)
const { closeHistoryLogModals } = patientsLogicStore

// Estados
const isLoading = ref(false)
const formData = ref({
  weight: '',
  height: '',
  familyHistory: '',
  notes: ''
})

// Función para cerrar el modal
function handleClose() {
  closeHistoryLogModals()
}

// Cargar datos del record cuando se abre en modo edición
function loadRecordData() {
  if (props.isEditing && props.record) {
    // Acceder a los datos según la estructura del backend
    const record = props.record.medicalRecord || props.record

    formData.value = {
      weight: record.weight || '',
      height: record.height || '',
      familyHistory: record.familyHistory || '',
      notes: record.notes || ''
    }

  } else {
    // Resetear formulario para nuevo registro
    formData.value = {
      weight: '',
      height: '',
      familyHistory: '',
      notes: ''
    }
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  isLoading.value = true

  try {
    // Preparar datos para enviar según la estructura del backend
    const dataToSend = {
      weight: parseFloat(formData.value.weight) || null,
      height: parseFloat(formData.value.height) || null,
      familyHistory: formData.value.familyHistory || null,
      notes: formData.value.notes || null
    }

    emit('save', dataToSend)
  } catch (error) {
    console.error('Error al enviar formulario:', error)
  } finally {
    isLoading.value = false
  }
}

// Observar cambios en props para cargar datos
watch([() => props.isOpen, () => props.record], () => {
  if (props.isOpen) {
    nextTick(() => {
      loadRecordData()
    })
  }
}, { immediate: true })
</script>
