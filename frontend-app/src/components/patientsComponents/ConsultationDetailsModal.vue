<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-95">
    <div class="bg-gray-200 rounded-lg shadow-lg w-full max-w-4xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold">{{ $t('patients.consult-detail') }}</h2>
          <p class="text-gray-600 mt-1">{{ formatRecordDate(fullRecord?.createdAt || record?.createdAt) }}</p>
        </div>
        <button 
          @click="$emit('close')" 
          class="text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p class="ml-3 text-gray-600">{{ $t('general.loading') }}...</p>
      </div>

      <!-- Content when loaded -->
      <div v-else-if="fullRecord">
        <!-- Información general -->
        <div class="bg-blue-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">{{ $t('general.general-info') }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-600">{{ $t('general.date') }}:</span>
              <p class="font-medium">{{ formatRecordDate(fullRecord.createdAt) }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">{{ $t('general.status') }}:</span>
              <p class="font-medium">{{ fullRecord.status || 'Completado' }}</p>
            </div>
            <div v-if="fullRecord.patient">
              <span class="text-sm text-gray-600">{{ $t('general.patient') }}:</span>
              <p class="font-medium">{{ fullRecord.patient.firstName }} {{ fullRecord.patient.lastName }}</p>
            </div>
            <div v-if="fullRecord.summary">
              <span class="text-sm text-gray-600">{{ $t('general.summary') }}:</span>
              <p class="font-medium">{{ fullRecord.summary }}</p>
            </div>
          </div>
        </div>

        <!-- Nota de evolución -->
        <div class="bg-blue-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">{{ $t('patients.evolution-note') }}</h3>
          <div v-if="fullRecord.notes" class="bg-white rounded p-3">
            <p class="text-gray-700 whitespace-pre-line">{{ fullRecord.notes }}</p>
          </div>
          <div v-else class="text-gray-400 italic py-4">
            {{ $t('patients.no-evolution-note') }}
          </div>
        </div>

        <!-- Recetas médicas -->
        <div class="bg-green-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">{{ $t('patients.medical-recipe') }}</h3>
          <div v-if="fullRecord.recipes && fullRecord.recipes.length > 0">
            <div v-for="recipe in fullRecord.recipes" :key="recipe.id" class="bg-white rounded p-3 mb-3">
              <div class="text-sm text-gray-500 mb-2">
                Fecha: {{ formatRecordDate(recipe.createdAt) }}
              </div>
              <div class="whitespace-pre-line text-gray-700">{{ recipe.prescription }}</div>
              
              <!-- Botón para ver receta completa -->
              <button 
                @click="viewFullRecipe(recipe)"
                class="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {{ $t('patients.view-full-recipe') }}
              </button>
            </div>
          </div>
          <div v-else class="text-gray-400 italic py-4">
            {{ $t('patients.no-prescription') }}
          </div>
        </div>

        <!-- Exámenes -->
        <div v-if="fullRecord.exams && fullRecord.exams.length > 0" class="bg-purple-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">{{ $t('patients.exams') }}</h3>
          <div class="space-y-3">
            <div v-for="exam in fullRecord.exams" :key="exam.id" class="bg-white rounded p-3">
              <div class="font-medium text-gray-800 mb-2">{{ exam.examType || exam.name }}</div>
              <div v-if="exam.resultText" class="text-gray-700 whitespace-pre-line">
                {{ exam.resultText }}
              </div>
              <div v-if="exam.observations" class="text-sm text-gray-600 mt-2">
                <strong>Observaciones:</strong> {{ exam.observations }}
              </div>
              <div class="text-xs text-gray-500 mt-2">
                Fecha: {{ formatRecordDate(exam.examDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tratamientos -->
        <div v-if="fullRecord.treatments && fullRecord.treatments.length > 0" class="bg-yellow-100 rounded-lg p-4 shadow">
          <h3 class="text-lg font-semibold mb-2">{{ $t('patients.treatments') }}</h3>
          <div class="space-y-3">
            <div v-for="treatment in fullRecord.treatments" :key="treatment.id" class="bg-white rounded p-3">
              <div class="font-medium text-gray-800 mb-2">{{ treatment.treatmentType }}</div>
              <div v-if="treatment.description" class="text-gray-700 mb-2">
                {{ treatment.description }}
              </div>
              <div v-if="treatment.observaciones" class="text-sm text-gray-600">
                <strong>Observaciones:</strong> {{ treatment.observaciones }}
              </div>
              <div class="text-xs text-gray-500 mt-2">
                Fecha: {{ formatRecordDate(treatment.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="hasError" class="text-center py-8">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <p class="text-red-600 text-lg">{{ $t('general.error-loading-data') }}</p>
        <button 
          @click="loadFullRecord"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {{ $t('general.retry') }}
        </button>
      </div>

      <!-- Footer con acciones -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <button 
          @click="editRecord" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {{ $t('general.edit') }}
        </button>
        <button 
          @click="downloadRecord" 
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {{ $t('general.download') }}
        </button>
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {{ $t('general.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePatientsStore } from '@stores/patientsStore'

const props = defineProps({
  record: {
    type: Object,
    default: () => ({})
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'view-recipe', 'edit', 'download'])

// Estados locales
const fullRecord = ref(null)
const isLoading = ref(false)
const hasError = ref(false)

// Store
const patientsStore = usePatientsStore()

// Cargar datos completos cuando se abre el modal
async function loadFullRecord() {
  if (!props.record?.id) return

  isLoading.value = true
  hasError.value = false

  try {
    // Usar el endpoint GET /medicalrecords/{id}/details
    const details = await patientsStore.fetchMedicalRecordDetails(props.record.id)
    fullRecord.value = details
  } catch (error) {
    console.error('Error al cargar detalles del registro médico:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function formatRecordDate(dateString) {
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

function viewFullRecipe(recipe) {
  // Emitir evento para mostrar el panel de recetas de tu compañero
  emit('view-recipe', {
    prescription: recipe.prescription,
    createdAt: recipe.createdAt,
    patientName: fullRecord.value?.patient?.firstName + ' ' + fullRecord.value?.patient?.lastName,
    recipeId: recipe.id
  })
}

function editRecord() {
  emit('edit', fullRecord.value || props.record)
}

function downloadRecord() {
  emit('download', fullRecord.value || props.record)
}

// Observar cuando se abre el modal para cargar los datos
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadFullRecord()
  } else {
    // Limpiar datos cuando se cierra
    fullRecord.value = null
    hasError.value = false
  }
})

// Cargar al montar si ya está abierto
onMounted(() => {
  if (props.isOpen) {
    loadFullRecord()
  }
})
</script>