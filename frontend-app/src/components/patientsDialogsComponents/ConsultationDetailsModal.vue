<template>
  <general-dialog-modal ref="createDialog" @close-modal="handleClose" :isOpen="isOpen" dialogSize="max-w-6xl">
    <!-- Header -->
    <template #title>
      <div class="flex justify-between items-center px-6 py-2 border-b">
        <div>
          <h2 class="text-2xl font-bold ">{{ $t('patients.consult-detail') }}</h2>
          <p class=" text-opacity-90 mt-1">{{ formatDate(displayRecord?.createdAt) }}</p>
        </div>
        <button @click="handleClose" class="text-black hover:text-gray-400 text-3xl font-bold leading-none">×</button>
      </div>
    </template>

    <!-- Body -->
    <template #body>
      <div class="overflow-y-auto max-h-[calc(90vh-160px)]">
        <!-- Loading -->
        <div v-if="isLoadingMedicalRecords" class="flex flex-col justify-center items-center py-16">
          <div class="animate-spin h-12 w-12 border-4 border-gray-300 border-t-[#489FB5] rounded-full"></div>
          <p class="mt-4 text-gray-600">{{ $t('general.loading') }}...</p>
        </div>

        <!-- Content -->
        <div v-else-if="displayRecord" class="p-6 space-y-6">
          <div class="bg-gray-100 rounded-lg p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">{{ $t('general.general-info') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.date') }}:</span>
                <p class="text-gray-800 font-medium">{{ formatDate(displayRecord.createdAt) }}</p>
              </div>
              <div v-if="displayRecord.patient">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.patient') }}:</span>
                <p class="text-gray-800 font-medium">
                  {{ displayRecord.patient.name || displayRecord.patient.firstName }} {{ displayRecord.patient.lastName }}
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.status') }}:</span>
                <span class="inline-block px-3 py-1 text-sm font-bold rounded-full text-white" style="background-color: #48C9B0;">
                  {{ displayRecord.status || 'Completado' }}
                </span>
              </div>
              <div v-if="displayRecord.diagnosis">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('general.diagnosis') }}:</span>
                <p class="text-gray-800 font-medium">{{ displayRecord.diagnosis }}</p>
              </div>
              <div v-if="displayRecord.weight">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('patients.weight') }}:</span>
                <p class="text-gray-800 font-medium">{{ displayRecord.weight }} kg</p>
              </div>
              <div v-if="displayRecord.height">
                <span class="text-sm text-gray-600 font-semibold">{{ $t('patients.height') }}:</span>
                <p class="text-gray-800 font-medium">{{ displayRecord.height }} cm</p>
              </div>
            </div>
          </div>
          <div v-if="displayRecord.familyHistory" class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #9B59B6;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.family-history') }}</h3>
            </div>
            <div class="bg-white rounded p-3 border-l-4" style="border-color: #9B59B6;">
              <p class="text-gray-800 whitespace-pre-line">{{ displayRecord.familyHistory }}</p>
            </div>
          </div>

          <!-- Nota de evolución -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-2" style="background-color: #489FB5;"></div>
                <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.evolution-note') }}</h3>
              </div>
              <button
                @click="editEvolutionNote"
                class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium rounded flex items-center gap-1"
              >
                ✏️ {{ $t('general.edit') }}
              </button>
            </div>
            <div v-if="displayRecord.notes && displayRecord.notes.trim()" class="bg-white rounded p-3 border-l-4" style="border-color: #489FB5;">
              <p class="text-gray-800 whitespace-pre-line">{{ displayRecord.notes }}</p>
            </div>
            <div v-else-if="displayRecord.medicalRecord?.notes && displayRecord.medicalRecord.notes.trim()" class="bg-white rounded p-3 border-l-4" style="border-color: #489FB5;">
              <p class="text-gray-800 whitespace-pre-line">{{ displayRecord.medicalRecord.notes }}</p>
            </div>
            <div v-else class="text-center py-6">
              <div class="text-gray-400 text-4xl mb-2">📝</div>
              <p class="text-gray-500">{{ $t('patients.no-evolution-note') }}</p>
              <button
                @click="editEvolutionNote"
                class="mt-3 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                ✏️ {{ $t('general.edit') }}
              </button>
            </div>
          </div>

          <!-- Recetas médicas -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-2" style="background-color: var(--primary-color);"></div>
                <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.medical-recipe') }}</h3>
              </div>
            </div>
            <div v-if="displayRecord.recipes && displayRecord.recipes.length > 0" class="space-y-3">
              <div v-for="recipe in displayRecord.recipes" :key="recipe.id" class="bg-white rounded-lg p-4 border relative">
                <button
                  @click="openRecipeFormModal(recipe)"
                  class="absolute top-3 right-3 px-2 py-1 text-green-600 hover:text-green-800 text-sm font-medium rounded flex items-center gap-1"
                  title="Editar receta"
                >
                  ✏️ Editar
                </button>
                <div class="text-sm text-gray-600 mb-2 font-semibold pr-16">
                  📅 {{ formatDate(recipe.createdAt) }}
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
          <div v-if="displayRecord.exams && displayRecord.exams.length > 0" class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #F4A261;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.exams') }}</h3>
            </div>
            <div class="space-y-3">
              <div v-for="exam in displayRecord.exams" :key="exam.id" class="bg-white rounded-lg p-4 border">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">{{ exam.exam?.name || exam.name || 'Examen' }}</h4>
                  <span class="text-xs px-2 py-1 rounded-full text-white font-semibold" style="background-color: #F4A261;">
                    {{ formatDate(exam.createdAt) }}
                  </span>
                </div>
                <div v-if="exam.exam?.description" class="text-sm text-gray-600 mb-2">
                  <strong>Descripción:</strong> {{ exam.exam.description }}
                </div>
                <div v-if="exam.resultText" class="bg-gray-50 rounded p-3 mb-2">
                  <div class="text-sm text-gray-600 mb-1 font-semibold">Resultados:</div>
                  <p class="text-gray-800 whitespace-pre-line">{{ exam.resultText }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tratamientos -->
          <div v-if="displayRecord.treatments && displayRecord.treatments.length > 0" class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full mr-2" style="background-color: #48C9B0;"></div>
              <h3 class="text-lg font-bold text-gray-800">{{ $t('patients.treatments') }}</h3>
            </div>
            <div class="space-y-3">
              <div v-for="treatment in displayRecord.treatments" :key="treatment.id" class="bg-white rounded-lg p-4 border">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">{{ treatment.medicine?.name || 'Medicamento' }}</h4>
                  <span class="text-xs px-2 py-1 rounded-full text-white font-semibold" style="background-color: #48C9B0;">
                    {{ formatDate(treatment.createdAt) }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                  <div v-if="treatment.dosage">
                    <strong>Dosis:</strong> {{ treatment.dosage }}
                  </div>
                  <div v-if="treatment.frequency">
                    <strong>Frecuencia:</strong> {{ treatment.frequency }}
                  </div>
                  <div v-if="treatment.duration">
                    <strong>Duración:</strong> {{ treatment.duration }}
                  </div>
                </div>
                <div v-if="treatment.medicine?.type" class="text-sm text-gray-600 mb-2">
                  <strong>Tipo:</strong> {{ treatment.medicine.type }}
                </div>
                <div v-if="treatment.observations" class="bg-gray-50 rounded p-3">
                  <div class="text-sm text-gray-600 mb-1 font-semibold">Observaciones:</div>
                  <p class="text-gray-800">{{ treatment.observations }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="hasError" class="text-center py-16">
          <div class="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 class="text-xl font-bold text-red-600 mb-2">{{ $t('general.error-loading-data') }}</h3>
          <p class="text-gray-600 mb-6">No se pudieron cargar los detalles de la consulta</p>
          <button @click="loadFullRecord" class="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity" style="background-color: #489FB5;">
            {{ $t('general.retry') }}
          </button>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #buttons>
      <primary-button @click="editRecord" class="mr-2" bgColor="orange">
        <p class="uppercase">{{ $t('general.edit') }}</p>
      </primary-button>
      <primary-button @click="downloadRecord">
        <p class="uppercase">{{ $t('general.download') }}</p>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { onMounted, watch, computed, nextTick } from 'vue'
import { usePatientsStore } from '@stores/patientsStore'
import { usePatientsLogicStore } from '../../stores/patientsLogicStore'
import { storeToRefs } from 'pinia'

import { formatDate } from '@/utils/isoFormatDate.js'

import PrimaryButton from '@components/forms/PrimaryButton.vue'
import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'

const props = defineProps({
  record: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close', 'view-recipe', 'edit', 'download'])

const patientsStore = usePatientsStore()
const { fullRecord, isLoadingMedicalRecords, hasError } = storeToRefs(patientsStore)

const patientsLogicStore = usePatientsLogicStore()
const { selectedRecord } = storeToRefs(patientsLogicStore)
const { closeHistoryLogModals, openMedicalRecordEditModal, openRecipeFormModal } = patientsLogicStore

const handleClose = () => {
  closeHistoryLogModals()
}

const displayRecord = computed(() => fullRecord.value)
// 🎯 Solo llama a la store (sin try/catch)
async function loadFullRecord() {
    await patientsStore.fetchMedicalRecordDetails(selectedRecord.value.id)
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
  } catch {
    return 'Fecha inválida'
  }
}

function editRecord() {
  emit('edit', displayRecord.value)
}

function editEvolutionNote() {
  // Cerrar el modal actual primero
  handleClose()
  // Luego abrir modal de edición de medical record
  nextTick(() => {
    openMedicalRecordEditModal(displayRecord.value)
  })
}

function viewFullRecipe(recipe) {
  emit('view-recipe', recipe)
}

function downloadRecord() {
  emit('download', displayRecord.value)
}

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await loadFullRecord()
  } else {
    patientsStore.clearFullRecord()
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadFullRecord()
  }
})
</script>
