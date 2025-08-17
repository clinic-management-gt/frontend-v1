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
          <!-- Información de la receta -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Receta médica</h3>

            <!-- Prescripción -->
            <div>
              <custom-label title="Prescripción médica" />
              <textarea 
                v-model="formData.prescription" 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                rows="8" 
                placeholder="Escriba aquí la prescripción médica completa..."
                required
              ></textarea>
            </div>

            <!-- Información adicional (solo para mostrar) -->
            <div v-if="recipe && recipe.createdAt" class="mt-4 text-sm text-gray-500">
              <p><strong>Fecha de creación:</strong> {{ formatDate(recipe.createdAt) }}</p>
              <p v-if="recipe.treatmentId"><strong>ID de tratamiento:</strong> {{ recipe.treatmentId }}</p>
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

// Función para cerrar el modal
function handleClose() {
  closeHistoryLogModals()
  emit('close')
}

// Cargar datos de la receta cuando se abre en modo edición
function loadRecipeData() {
  if (props.isEditing && props.recipe) {
    formData.value = {
      prescription: props.recipe.prescription || ''
    }
  } else {
    // Resetear formulario para nueva receta
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
      notificationStore.addNotification('success', 'Éxito', 'Receta actualizada exitosamente')
    } else {
      dataToSend.treatmentId = props.treatmentId
      result = await createRecipe(dataToSend)
      notificationStore.addNotification('success', 'Éxito', 'Receta creada exitosamente')
    }

    emit('save', result)
    handleClose()
  } catch (error) {
    console.error('Error al procesar receta:', error)
    // Las notificaciones de error las maneja axios interceptor
  } finally {
    isLoading.value = false
  }
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
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
    })
  }
}, { immediate: true })
</script>
