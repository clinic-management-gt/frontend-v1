<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div>
          <h2 class="text-2xl font-bold">{{ $t('patients.consult-detail') }}</h2>
          <p class="text-blue-100 mt-1">{{ formatRecordDate(record?.createdAt) }}</p>
        </div>
        <button 
          @click="$emit('close')" 
          class="text-white hover:text-gray-200 text-2xl p-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          &times;
        </button>
      </div>

      <!-- Contenido scrolleable -->
      <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
        <div class="p-6 space-y-6">
          
          <!-- Información general -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-800">{{ $t('general.general-info') }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">{{ $t('general.date') }}:</span>
                <p class="font-medium">{{ formatRecordDate(record?.createdAt) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-600">{{ $t('general.status') }}:</span>
                <p class="font-medium">{{ record?.status || 'Completado' }}</p>
              </div>
              <div v-if="record?.appointmentType">
                <span class="text-sm text-gray-600">{{ $t('general.appointment-type') }}:</span>
                <p class="font-medium">{{ record.appointmentType }}</p>
              </div>
              <div v-if="record?.diagnosis">
                <span class="text-sm text-gray-600">{{ $t('general.diagnosis') }}:</span>
                <p class="font-medium">{{ record.diagnosis }}</p>
              </div>
            </div>
          </div>

          <!-- Nota de evolución -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-blue-800">{{ $t('patients.evolution-note') }}</h3>
            <div v-if="record?.evolutionNote" class="prose max-w-none">
              <p class="text-gray-700 whitespace-pre-line">{{ record.evolutionNote }}</p>
            </div>
            <div v-else class="text-gray-400 italic py-4">
              {{ $t('patients.no-evolution-note') }}
            </div>
          </div>

          <!-- Receta médica -->
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-green-800">{{ $t('patients.medical-recipe') }}</h3>
            <div v-if="record?.prescription && record.prescription.length > 0">
              <div v-for="(med, index) in record.prescription" :key="index" class="mb-3 p-3 bg-white rounded border">
                <div class="font-medium text-gray-800">{{ med.medicine || med.name }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  <span v-if="med.dosage"><strong>Dosis:</strong> {{ med.dosage }}</span>
                  <span v-if="med.frequency" class="ml-4"><strong>Frecuencia:</strong> {{ med.frequency }}</span>
                  <span v-if="med.duration" class="ml-4"><strong>Duración:</strong> {{ med.duration }}</span>
                </div>
                <div v-if="med.observations" class="text-sm text-gray-500 mt-1">
                  <strong>Observaciones:</strong> {{ med.observations }}
                </div>
              </div>
            </div>
            <div v-else class="text-gray-400 italic py-4">
              {{ $t('patients.no-prescription') }}
            </div>
          </div>

          <!-- Exámenes -->
          <div v-if="record?.exams && record.exams.length > 0" class="bg-purple-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-purple-800">{{ $t('patients.exams') }}</h3>
            <div class="space-y-2">
              <div v-for="(exam, index) in record.exams" :key="index" class="p-3 bg-white rounded border">
                <div class="font-medium text-gray-800">{{ exam.name || exam.type }}</div>
                <div v-if="exam.result" class="text-sm text-gray-600 mt-1">
                  <strong>Resultado:</strong> {{ exam.result }}
                </div>
                <div v-if="exam.observations" class="text-sm text-gray-500 mt-1">
                  {{ exam.observations }}
                </div>
              </div>
            </div>
          </div>

          <!-- Observaciones generales -->
          <div v-if="record?.observations" class="bg-yellow-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-yellow-800">{{ $t('general.observations') }}</h3>
            <p class="text-gray-700 whitespace-pre-line">{{ record.observations }}</p>
          </div>

        </div>
      </div>

      <!-- Footer con acciones -->
      <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <button 
          @click="editRecord" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <action-button-solid-icon icon="PencilIcon" size="h-4 w-4" color="text-white" />
          {{ $t('general.edit') }}
        </button>
        <button 
          @click="downloadRecord" 
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <action-button-solid-icon icon="ArrowDownTrayIcon" size="h-4 w-4" color="text-white" />
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
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'

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

const emit = defineEmits(['close', 'edit', 'download'])

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

function editRecord() {
  emit('edit', props.record)
}

function downloadRecord() {
  emit('download', props.record)
}
</script>