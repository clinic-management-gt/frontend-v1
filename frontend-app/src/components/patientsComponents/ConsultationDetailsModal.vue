<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header simple y limpio -->
      <div class="flex justify-between items-center p-6 border-b" style="background-color: var(--primary-color);">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ $t('patients.consult-detail') }}</h2>
          <p class="text-white text-opacity-90 mt-1">{{ formatRecordDate(fullRecord?.createdAt || record?.createdAt) }}</p>
        </div>
        <button 
          @click="$emit('close')" 
          class="text-white hover:text-gray-200 text-3xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      <!-- Contenido scrolleable -->
      <div class="overflow-y-auto max-h-[calc(90vh-160px)]">
        <!-- Loading state simple -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center py-16">
          <div class="animate-spin h-12 w-12 border-4 border-gray-300 border-t-[#489FB5] rounded-full"></div>
          <p class="mt-4 text-gray-600">{{ $t('general.loading') }}...</p>
        </div>

        <!-- Content when loaded -->
        <div v-else-if="fullRecord" class="p-6 space-y-6">
          
          <!-- Información general -->
          <div class="bg-gray-100 rounded-lg p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">{{ $t('general.general-info') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.date') }}:</span>
                <p class="text-gray-800 font-medium">{{ formatRecordDate(fullRecord.createdAt) }}</p>
              </div>
              <div v-if="fullRecord.patient">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.patient') }}:</span>
                <p class="text-gray-800 font-medium">{{ fullRecord.patient.firstName }} {{ fullRecord.patient.lastName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.status') }}:</span>
                <span class="inline-block px-3 py-1 text-sm font-bold rounded-full text-white" 
                      style="background-color: #48C9B0;">
                  {{ fullRecord.status || 'Completado' }}
                </span>
              </div>
              <div v-if="fullRecord.diagnosis">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.diagnosis') }}:</span>
                <p class="text-gray-800 font-medium">{{ fullRecord.diagnosis }}</p>
              </div>
            </div>
          </div>

          <!-- Nota de evolución -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #489FB5;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.evolution-note') }}</h3>
            </div>
            <div v-if="fullRecord.notes && fullRecord.notes.trim()" class="bg-white rounded p-3 border-l-4" style="border-color: #489FB5;">
              <p class="text-gray-800 whitespace-pre-line">{{ fullRecord.notes }}</p>
            </div>
            <div v-else class="text-center py-6">
              <div class="text-gray-400 text-4xl mb-2">📝</div>
              <p class="text-gray-500">{{ $t('patients.no-evolution-note') }}</p>
            </div>
          </div>

          <!-- Recetas médicas -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: var(--primary-color);"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.medical-recipe') }}</h3>
            </div>
            <div v-if="fullRecord.recipes && fullRecord.recipes.length > 0" class="space-y-3">
              <div v-for="recipe in fullRecord.recipes" :key="recipe.id" class="bg-white rounded-lg p-4 border">
                <div class="text-sm text-gray-600 mb-2 font-semibold">
                  📅 {{ formatRecordDate(recipe.createdAt) }}
                </div>
                <div class="bg-gray-50 rounded p-3 mb-3">
                  <pre class="text-gray-800 text-sm whitespace-pre-wrap font-mono">{{ recipe.prescription }}</pre>
                </div>
                <button 
                  @click="viewFullRecipe(recipe)"
                  class="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style="background-color: var(--primary-color);"
                >
                  {{ $t('patients.view-full-recipe') }}
                </button>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <div class="text-gray-400 text-4xl mb-2">💊</div>
              <p class="text-gray-500">{{ $t('patients.no-prescription') }}</p>
            </div>
          </div>

          <!-- Exámenes -->
          <div v-if="fullRecord.exams && fullRecord.exams.length > 0" class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #F4A261;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.exams') }}</h3>
            </div>
            <div class="space-y-3">
              <div v-for="exam in fullRecord.exams" :key="exam.id" class="bg-white rounded-lg p-4 border">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">{{ exam.examType || exam.name }}</h4>
                  <span class="text-xs px-2 py-1 rounded-full text-white font-semibold" style="background-color: #F4A261;">
                    {{ formatRecordDate(exam.examDate) }}
                  </span>
                </div>
                <div v-if="exam.resultText" class="bg-gray-50 rounded p-3 mb-2">
                  <div class="text-sm text-gray-600 mb-1 font-semibold">{{ $t('patients.result') }}:</div>
                  <p class="text-gray-800">{{ exam.resultText }}</p>
                </div>
                <div v-if="exam.observations" class="text-sm text-gray-600">
                  <strong>{{ $t('general.observations') }}:</strong> {{ exam.observations }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tratamientos -->
          <div v-if="fullRecord.treatments && fullRecord.treatments.length > 0" class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #48C9B0;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.treatments') }}</h3>
            </div>
            <div class="space-y-3">
              <div v-for="treatment in fullRecord.treatments" :key="treatment.id" class="bg-white rounded-lg p-4 border">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">{{ treatment.treatmentType }}</h4>
                  <span class="text-xs px-2 py-1 rounded-full text-white font-semibold" style="background-color: #48C9B0;">
                    {{ formatRecordDate(treatment.createdAt) }}
                  </span>
                </div>
                <div v-if="treatment.description" class="bg-gray-50 rounded p-3 mb-2">
                  <p class="text-gray-800">{{ treatment.description }}</p>
                </div>
                <div v-if="treatment.observaciones" class="text-sm text-gray-600">
                  <strong>{{ $t('general.observations') }}:</strong> {{ treatment.observaciones }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error state simple -->
        <div v-else-if="hasError" class="text-center py-16">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 class="text-xl font-bold text-red-600 mb-2">{{ $t('general.error-loading-data') }}</h3>
          <p class="text-gray-600 mb-6">No se pudieron cargar los detalles de la consulta</p>
          <button 
            @click="loadFullRecord"
            class="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style="background-color: #489FB5;"
          >
            {{ $t('general.retry') }}
          </button>
        </div>
      </div>

      <!-- Footer simple -->
      <div class="border-t bg-gray-50 px-6 py-4">
        <div class="flex justify-end gap-3">
          <button 
            @click="editRecord" 
            class="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style="background-color: #489FB5;"
          >
            {{ $t('general.edit') }}
          </button>
          <button 
            @click="downloadRecord" 
            class="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style="background-color: var(--primary-color);"
          >
            {{ $t('general.download') }}
          </button>
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            {{ $t('general.close') }}
          </button>
        </div>
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