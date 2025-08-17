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
                <custom-label :title="$t('patients.weight-kg')" />
                <text-input v-model="formData.weight" type="number" step="0.1" placeholder="70.5" />
              </div>
              <div>
                <custom-label :title="$t('patients.height-cm')" />
                <text-input v-model="formData.height" type="number" step="0.1" placeholder="175.2" />
              </div>
            </div>

            <!-- Antecedentes familiares -->
            <div class="mb-4">
              <custom-label :title="$t('patients.family-background')" />
              <textarea v-model="formData.familyHistory" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows="3" placeholder="Antecedentes familiares del paciente..."></textarea>
            </div>

            <!-- Notas de evolución -->
            <div>
              <custom-label :title="$t('patients.evolution-note-detail')" />
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
const { updateMedicalRecord, createMedicalRecord, fetchPatientMedicalRecords } = patientsStore

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
      weight: record.weight ? String(record.weight) : '',
      height: record.height ? String(record.height) : '',
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
  console.log('🚀 handleSubmit llamado!')
  isLoading.value = true

  try {
    // Preparar datos para enviar según la estructura del backend
    const dataToSend = {
      Weight: parseFloat(formData.value.weight) || null,
      Height: parseFloat(formData.value.height) || null,
      FamilyHistory: formData.value.familyHistory || null,
      Notes: formData.value.notes || null
    }

    console.log('📝 Datos del formulario:', formData.value)
    console.log('📤 Datos a enviar:', dataToSend)
    console.log('🔍 Modo edición:', props.isEditing)
    console.log('📋 Record actual:', props.record)

    // Validar que tenemos los datos mínimos necesarios
    if (!formData.value.weight && !formData.value.height && !formData.value.familyHistory && !formData.value.notes) {
      console.warn('⚠️ Formulario vacío - no se puede procesar')
      notificationStore.addNotification('warning', 'Advertencia', 'Por favor completa al menos un campo')
      return
    }

    if (props.isEditing && props.record) {
      // Actualizar registro existente
      const recordId = props.record.medicalRecord?.id || props.record.id
      console.log(`✏️ Actualizando record ID: ${recordId}`)
      await updateMedicalRecord(recordId, dataToSend)
      notificationStore.addNotification('success', 'Éxito', 'Registro médico actualizado exitosamente')
    } else if (!props.isEditing && props.patientId) {
      // Crear nuevo registro solo si estamos en modo creación y tenemos patientId
      console.log(`➕ Creando nuevo record para paciente: ${props.patientId}`)
      dataToSend.PatientId = props.patientId
      await createMedicalRecord(props.patientId, dataToSend)
      notificationStore.addNotification('success', 'Éxito', 'Registro médico creado exitosamente')
    } else {
      // No hacer nada si no hay condiciones válidas
      console.warn('⚠️ No se puede procesar: condiciones inválidas')
      console.warn(`isEditing: ${props.isEditing}, patientId: ${props.patientId}, record:`, props.record)
      notificationStore.addNotification('warning', 'Advertencia', 'No se puede procesar la solicitud')
      return
    }

    // Recargar los datos del paciente
    await fetchPatientMedicalRecords(props.patientId)
    
    // Cerrar modal y emitir evento
    closeHistoryLogModals()
    emit('save', dataToSend)
  } catch (error) {
    console.error('❌ Error al enviar formulario:', error)
    console.error('📋 Detalles del error:', error.response?.data || error.message)
    console.log('🔍 Status del error:', error.response?.status)
    console.log('🔍 Headers del error:', error.response?.headers)
    console.log('🔍 Config de la petición:', error.config)
    
    // Log detallado de validation errors si existen
    if (error.response?.data?.errors) {
      console.log('❌ Errores de validación:', error.response.data.errors)
      Object.keys(error.response.data.errors).forEach(field => {
        console.log(`❌ Campo ${field}:`, error.response.data.errors[field])
      })
    }
    
    notificationStore.addNotification(
      'error', 
      'Error', 
      props.isEditing ? 'Error al actualizar el registro' : 'Error al crear el registro'
    )
  } finally {
    isLoading.value = false
  }
}

// Observar cambios en props para cargar datos
watch([() => props.isOpen, () => props.record, () => props.isEditing], () => {
  if (props.isOpen) {
    console.log('🔄 Modal abierto - Loading data with:', {
      isOpen: props.isOpen,
      isEditing: props.isEditing,
      record: props.record
    })
    nextTick(() => {
      loadRecordData()
    })
  }
}, { immediate: true })
</script>
