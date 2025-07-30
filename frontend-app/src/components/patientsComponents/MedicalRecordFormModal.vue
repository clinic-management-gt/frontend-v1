<template>
  <general-dialog-modal
    :is-open="isOpen"
    :title="isEditing ? 'Editar registro médico' : 'Agregar registro médico'"
    :show-confirm="false"
    custom-width="max-w-4xl"
    @close="handleClose"
  >
    <div class="space-y-6 max-h-[70vh] overflow-y-auto">
      <!-- Formulario principal -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Información básica -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Información básica</h3>
          
          <!-- Peso y Altura -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <custom-label>Peso (kg)</custom-label>
              <text-input
                v-model="formData.weight"
                type="number"
                step="0.1"
                placeholder="70.5"
              />
            </div>
            <div>
              <custom-label>Altura (cm)</custom-label>
              <text-input
                v-model="formData.height"
                type="number"
                step="0.1"
                placeholder="175.2"
              />
            </div>
          </div>

          <!-- Antecedentes familiares -->
          <div class="mb-4">
            <custom-label>Antecedentes familiares</custom-label>
            <textarea
              v-model="formData.familyHistory"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Antecedentes familiares del paciente..."
            ></textarea>
          </div>

          <!-- Notas de evolución -->
          <div>
            <custom-label>Notas de evolución</custom-label>
            <textarea
              v-model="formData.notes"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="Notas de evolución del paciente..."
            ></textarea>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 pt-4 border-t bg-white sticky bottom-0">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </general-dialog-modal>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'
import CustomLabel from '@components/forms/CustomLabel.vue'
import TextInput from '@components/forms/TextInput.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  record: {
    type: Object,
    default: null
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
  console.log('Cerrando modal...')
  emit('close')
}

// Cargar datos del record cuando se abre en modo edición
function loadRecordData() {
  console.log('Cargando datos...', { isEditing: props.isEditing, record: props.record })
  
  if (props.isEditing && props.record) {
    // Acceder a los datos según la estructura del backend
    const record = props.record.medicalRecord || props.record
    
    formData.value = {
      weight: record.weight || '',
      height: record.height || '', 
      familyHistory: record.familyHistory || '',
      notes: record.notes || ''
    }
    
    console.log('Datos cargados:', formData.value)
  } else {
    // Resetear formulario para nuevo registro
    formData.value = {
      weight: '',
      height: '',
      familyHistory: '',
      notes: ''
    }
    console.log('Formulario reseteado para nuevo registro')
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  console.log('Enviando formulario...', formData.value)
  isLoading.value = true
  
  try {
    // Preparar datos para enviar según la estructura del backend
    const dataToSend = {
      weight: parseFloat(formData.value.weight) || null,
      height: parseFloat(formData.value.height) || null,
      familyHistory: formData.value.familyHistory || null,
      notes: formData.value.notes || null
    }
    
    console.log('Datos a enviar:', dataToSend)
    emit('save', dataToSend)
  } catch (error) {
    console.error('Error al enviar formulario:', error)
  } finally {
    isLoading.value = false
  }
}

// Observar cambios en props para cargar datos
watch([() => props.isOpen, () => props.record], () => {
  console.log('Props cambiaron:', { isOpen: props.isOpen, record: props.record })
  if (props.isOpen) {
    nextTick(() => {
      loadRecordData()
    })
  }
}, { immediate: true })
</script>
