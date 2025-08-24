<template>
  <general-dialog-modal :is-open="isOpen" dialogSize="max-w-4xl" @close-modal="handleClose">
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <!-- Mostrar valor actual como referencia -->
                <div v-if="props.isEditing && originalValues.weight" class="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                  📊 Valor actual: {{ originalValues.weight }} kg
                </div>
                <input 
                  v-model="formData.weight" 
                  type="number" 
                  step="0.1" 
                  placeholder="Ingrese nuevo peso..." 
                  class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <!-- Mostrar valor actual como referencia -->
                <div v-if="props.isEditing && originalValues.height" class="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                  📊 Valor actual: {{ originalValues.height }} cm
                </div>
                <input 
                  v-model="formData.height" 
                  type="number" 
                  step="0.1" 
                  placeholder="Ingrese nueva altura..." 
                  class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <!-- Antecedentes familiares -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Antecedentes familiares</label>
              <textarea v-model="formData.familyHistory" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="3" placeholder="Antecedentes familiares del paciente..."></textarea>
            </div>

            <!-- Notas de evolución -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notas de evolución</label>
              <textarea v-model="formData.notes" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="4" placeholder="Notas de evolución del paciente..."></textarea>
            </div>
          </div>
        </form>
      </div>
    </template>

    <!-- Botones de acción -->
    <template #buttons>
      <primary-button v-if="isLoading" :disabled="isLoading">
        <span class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Guardando...
        </span>
      </primary-button>
      <primary-button v-else @click="handleSubmit" :disabled="isLoading">
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
import { usePatientsStore } from '@stores/patientsStore.js'
import { useNotificationStore } from '@stores/notificationStore.js'

import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
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
  record: {
    type: Object,
    default: () => null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const patientsLogicStore = usePatientsLogicStore()
const patientsStore = usePatientsStore()
const notificationStore = useNotificationStore()

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

// Valores originales para mostrar como referencia
const originalValues = ref({
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

    // Guardar valores originales para mostrar como referencia
    originalValues.value = {
      weight: record.weight ? String(record.weight) : '',
      height: record.height ? String(record.height) : '',
      familyHistory: record.familyHistory || '',
      notes: record.notes || ''
    }

    // Para peso y altura: dejar campos en blanco para nuevos valores
    // Para texto: mantener valores actuales para editarlos
    formData.value = {
      weight: '', // Campo en blanco para nuevo peso
      height: '', // Campo en blanco para nueva altura  
      familyHistory: record.familyHistory || '', // Mantener para editar
      notes: record.notes || '' // Mantener para editar
    }
  } else {
    // Resetear formulario para nuevo registro
    originalValues.value = {
      weight: '',
      height: '',
      familyHistory: '',
      notes: ''
    }
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
    // Si se ingresa nuevo valor, usar ese; si no, mantener el original (si existe)
    let weightToSend = null
    let heightToSend = null

    // Para peso: usar nuevo valor si se ingresó, sino mantener original
    if (formData.value.weight !== '' && formData.value.weight !== null && formData.value.weight !== undefined) {
      weightToSend = parseFloat(formData.value.weight)
    } else if (props.isEditing && originalValues.value.weight) {
      weightToSend = parseFloat(originalValues.value.weight)
    }

    // Para altura: usar nuevo valor si se ingresó, sino mantener original  
    if (formData.value.height !== '' && formData.value.height !== null && formData.value.height !== undefined) {
      heightToSend = parseFloat(formData.value.height)
    } else if (props.isEditing && originalValues.value.height) {
      heightToSend = parseFloat(originalValues.value.height)
    }

    const dataToSend = {
      Weight: weightToSend,
      Height: heightToSend,
      FamilyHistory: formData.value.familyHistory || null,
      Notes: formData.value.notes || null
    }

    // Validar que tenemos los datos mínimos necesarios
    if (!dataToSend.Weight && !dataToSend.Height && !dataToSend.FamilyHistory && !dataToSend.Notes) {
      notificationStore.addNotification('warning', 'general.warning', 'Por favor completa al menos un campo')
      return
    }

    if (props.isEditing && props.record) {
      // Actualizar registro existente - usar el store de lógica
      await patientsLogicStore.handleMedicalRecordSave(dataToSend, props.patientId)
    } else if (!props.isEditing && props.patientId) {
      // Crear nuevo registro usando el store de lógica
      await patientsLogicStore.handleMedicalRecordSave(dataToSend, props.patientId)
    } else {
      // No hacer nada si no hay condiciones válidas
      notificationStore.addNotification('warning', 'general.warning', 'No se puede procesar la solicitud')
      return
    }

    // El store de lógica ya maneja el cierre del modal y recarga de datos
    emit('save', dataToSend)
  } catch (error) {
    notificationStore.addNotification(
      'error', 
      'general.error', 
      props.isEditing ? 'Error al actualizar el registro' : 'Error al crear el registro'
    )
  } finally {
    isLoading.value = false
  }
}

// Observar cambios en props para cargar datos
watch([() => props.isOpen, () => props.record, () => props.isEditing], () => {
  if (props.isOpen) {
    nextTick(() => {
      loadRecordData()
    })
  }
}, { immediate: true })
</script>
