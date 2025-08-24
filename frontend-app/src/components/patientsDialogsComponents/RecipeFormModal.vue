<template>
  <general-dialog-modal :is-open="isOpen" dialogSize="max-w-2xl" @close-modal="handleClose">
    <template #title>
      <p class="text-xl">
        {{ isEditing ? 'Editar receta médica' : 'Crear receta médica' }}
      </p>
    </template>
    <template #body>
      <div class="space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Formulario principal -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Alerta si no hay treatmentId -->
          <div v-if="!props.isEditing && !props.treatmentId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="text-yellow-400 text-lg mr-2">⚠️</div>
              <div>
                <h4 class="text-yellow-800 font-semibold">Advertencia</h4>
                <p class="text-yellow-700 text-sm">
                  No se encontró un tratamiento asociado. Para crear una receta, primero debe haber un tratamiento registrado en esta consulta.
                </p>
              </div>
            </div>
          </div>

          <!-- Información de la receta -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Receta médica</h3>

            <!-- Prescripción -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prescripción médica</label>
              
              <!-- Mostrar fecha de creación actual como referencia -->
              <div v-if="props.isEditing && originalValues.createdAt" class="mb-3 text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                <div class="flex items-center justify-between">
                  <span>📅 <strong>Fecha de creación:</strong> {{ formatDate(originalValues.createdAt) }}</span>
                  <span v-if="originalValues.updatedAt" class="ml-4">✏️ <strong>Última edición:</strong> {{ formatDate(originalValues.updatedAt) }}</span>
                </div>
                <div v-if="originalValues.treatmentId" class="mt-1">
                  🔗 <strong>ID de tratamiento:</strong> {{ originalValues.treatmentId }}
                </div>
              </div>
              
              <textarea 
                v-model="formData.prescription" 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                rows="8" 
                placeholder="Escriba aquí la prescripción médica completa..."
                tabindex="0"
                required
              ></textarea>
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
      <primary-button v-else @click="handleSubmit" :disabled="isLoading || !formData.prescription.trim()">
        <p class="uppercase">
          {{ isEditing ? 'Actualizar' : 'Guardar' }}
        </p>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { usePatientsStore } from '@stores/patientsStore.js'
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import { useNotificationStore } from '@stores/notificationStore.js'

import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import CustomLabel from '@components/forms/CustomLabel.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  recipe: {
    type: Object,
    default: () => null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  treatmentId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const patientsStore = usePatientsStore()
const patientsLogicStore = usePatientsLogicStore()
const notificationStore = useNotificationStore()

const { updateRecipe, createRecipe } = patientsStore
const { closeHistoryLogModals } = patientsLogicStore

// Estados
const isLoading = ref(false)
const formData = ref({
  prescription: ''
})

// Valores originales para mostrar como referencia
const originalValues = ref({
  createdAt: '',
  updatedAt: '',
  treatmentId: ''
})

// Función para cerrar el modal
function handleClose() {
  closeHistoryLogModals()
  emit('close')
}

// Cargar datos de la receta cuando se abre en modo edición
function loadRecipeData() {
  if (props.isEditing && props.recipe) {
    // Guardar valores originales para mostrar como referencia
    originalValues.value = {
      createdAt: props.recipe.createdAt || '',
      updatedAt: props.recipe.updatedAt || '',
      treatmentId: props.recipe.treatmentId || ''
    }

    formData.value = {
      prescription: props.recipe.prescription || ''
    }
  } else {
    // Resetear valores para nueva receta
    originalValues.value = {
      createdAt: '',
      updatedAt: '',
      treatmentId: ''
    }
    
    formData.value = {
      prescription: ''
    }
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  if (!formData.value.prescription.trim()) {
    return
  }

  isLoading.value = true

  try {
    const dataToSend = {
      prescription: formData.value.prescription.trim()
    }

    let result
    if (props.isEditing && props.recipe?.id) {
      // Actualizar receta existente
      result = await updateRecipe(props.recipe.id, dataToSend)
      
      // Actualizar la fecha de última edición con la fecha actual
      const now = new Date().toISOString()
      
      // Forzar reactividad creando un nuevo objeto
      originalValues.value = {
        ...originalValues.value,
        updatedAt: now
      }
      
      // Asegurar que Vue detecte el cambio
      await nextTick()
      
      alert('Receta actualizada exitosamente')
    } else {
      // Crear nueva receta
      if (props.treatmentId) {
        dataToSend.treatmentId = props.treatmentId
      } else {
        alert('No se puede crear la receta: falta treatmentId')
        return
      }
      result = await createRecipe(dataToSend)
      alert('Receta creada exitosamente')
    }

    emit('save', result)
    handleClose()
  } catch (error) {
    alert('Error al guardar la receta: ' + (error.message || 'Error desconocido'))
  } finally {
    isLoading.value = false
  }
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

// Observar cambios en props para cargar datos
watch([() => props.isOpen, () => props.recipe], () => {
  if (props.isOpen) {
    nextTick(() => {
      loadRecipeData()
      // Intentar enfocar el textarea después de que se cargue
      setTimeout(() => {
        // Quitar el foco del elemento actual
        if (document.activeElement) {
          document.activeElement.blur()
        }
        
        const textarea = document.querySelector('textarea[placeholder*="prescripción"]')
        if (textarea) {
          // Forzar el enfoque múltiples veces para asegurar que funcione
          textarea.focus()
          textarea.click()
          textarea.focus()
        }
      }, 500) // Aumenté el delay a 500ms
    })
  }
}, { immediate: true })
</script>
