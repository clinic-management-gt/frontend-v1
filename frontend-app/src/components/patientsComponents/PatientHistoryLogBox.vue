<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <p class="text-2xl font-bold">{{ $t('patients.patient-history') }}</p>
      
      <!-- Selector de elementos por página -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">{{ $t('general.show') }}:</label>
        <select 
          v-model="itemsPerPage" 
          @change="resetPagination"
          class="px-2 py-1 border rounded text-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        <span class="text-sm text-gray-600">{{ $t('general.elements') }}</span>
      </div>
    </div>

    <!-- Lista de registros médicos -->
    <div v-if="paginatedRecords.length > 0">
      <div
        v-for="item in paginatedRecords"
        :key="item.id"
        class="mb-2 cursor-pointer"
        @click="openRecordDetails(item)"
      >
        <div class="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 shadow-sm transition-colors duration-200">
          <div class="flex justify-between items-center gap-2">
            <!-- Información principal -->
            <div class="flex-1">
              <p class="text-xl font-semibold text-gray-800">
                {{ formatRecordDate(item.createdAt) }}
              </p>
              <p v-if="item.diagnosis" class="text-sm text-gray-600 mt-1">
                <strong>Diagnóstico:</strong> {{ item.diagnosis }}
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2">
              <!-- Botón ver detalles -->
              <action-button-solid-icon 
                icon="EyeIcon" 
                size="h-10 w-10" 
                color="text-patient-page-color" 
                @click.stop="openRecordDetails(item)"
                :title="$t('general.view')"
              />
              
              <!-- Botón editar -->
              <action-button-solid-icon 
                icon="PencilIcon" 
                size="h-10 w-10" 
                color="text-patient-page-color" 
                @click.stop="editRecord(item)"
                :title="$t('general.edit')"
              />
              
              <!-- Botón descargar -->
              <action-button-solid-icon 
                icon="ArrowDownTrayIcon" 
                size="h-10 w-10" 
                color="text-patient-page-color" 
                @click.stop="downloadRecord(item)"
                :title="$t('general.download')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <p class="text-gray-500 text-lg">{{ $t('patients.no-medical-records') }}</p>
    </div>

    <!-- Paginación (mantener la misma que ya tienes) -->
    <!-- ... código de paginación ... -->

    <!-- Modal de detalles mejorado -->
    <consultation-details-modal
      v-if="showDetailsModal"
      :record="selectedRecord"
      :is-open="showDetailsModal"
      @close="closeDetailsModal"
      @view-recipe="handleViewRecipe"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { usePatientsStore } from '@stores/patientsStore'
import { storeToRefs } from 'pinia'
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'
import ConsultationDetailsModal from './ConsultationDetailsModal.vue'

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['view-recipe'])

// Store
const patientsStore = usePatientsStore()
const { currentPatientMedicalRecords, isLoadingMedicalRecords } = storeToRefs(patientsStore)

// Estados locales
const itemsPerPage = ref(10)
const currentPage = ref(1)
const showDetailsModal = ref(false)
const selectedRecord = ref(null)

// Computados para paginación (mantener los mismos)
const totalRecords = computed(() => currentPatientMedicalRecords.value?.length || 0)
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value))
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return currentPatientMedicalRecords.value?.slice(start, end) || []
})

// Métodos
async function openRecordDetails(record) {
  try {
    // Simplemente pasar el record, el modal se encargará de cargar los detalles
    selectedRecord.value = record
    showDetailsModal.value = true
  } catch (error) {
    console.error('Error al abrir detalles del registro:', error)
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedRecord.value = null
}

function handleViewRecipe(recipe) {
  // Emitir evento hacia el padre (PatientsView) para mostrar el panel de recetas
  emit('view-recipe', recipe)
  closeDetailsModal()
}

function formatRecordDate(dateString) {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  if (props.patientId) {
    await patientsStore.fetchPatientMedicalRecords(props.patientId)
  }
})

// Observar cambios en el ID del paciente
watch(() => props.patientId, async (newId) => {
  if (newId) {
    currentPage.value = 1
    await patientsStore.fetchPatientMedicalRecords(newId)
  }
})
</script>