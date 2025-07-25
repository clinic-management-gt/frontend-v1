<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <p class="text-2xl font-bold">{{ $t('patients.patient-history') }}</p>
      
      <!-- Botón para agregar nuevo registro -->
      <div class="flex items-center gap-4">
        <primary-button
          @click="openCreateModal"
          size="sm"
        >
          + {{ $t('patients.add-medical-record') }}
        </primary-button>
        
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
    </div>

    <!-- Lista de registros médicos -->
    <div v-if="paginatedRecords.length > 0">
      <div
        v-for="item in paginatedRecords"
        :key="item.id"
        class="mb-3 cursor-pointer"
        @click="openRecordDetails(item)"
      >
        <div class="bg-gray-200 hover:bg-gray-300 rounded-lg p-4 transition-colors duration-200">
          <div class="flex justify-between items-center gap-2">
            <!-- Información principal -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-3 h-3 rounded-full" style="background-color: var(--primary-color);"></div>
                <p class="text-lg font-bold text-gray-800">
                  {{ formatRecordDate(item.createdAt) }}
                </p>
              </div>
              <p v-if="item.diagnosis" class="text-sm text-gray-600 ml-5">
                <strong>Diagnóstico:</strong> {{ item.diagnosis }}
              </p>
              <div class="flex gap-4 ml-5 mt-1">
                <span v-if="item.notes" class="text-xs text-blue-600">📝 Notas</span>
                <span v-if="item.prescription" class="text-xs text-green-600">💊 Recetas</span>
                <span v-if="item.treatments && item.treatments.length > 0" class="text-xs text-purple-600">🩺 Tratamientos</span>
                <span v-if="item.exams && item.exams.length > 0" class="text-xs text-orange-600">📋 Exámenes</span>
              </div>
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
              
              <!-- Botón eliminar -->
              <action-button-solid-icon 
                icon="TrashIcon" 
                size="h-10 w-10" 
                color="text-red-600" 
                @click.stop="deleteRecord(item)"
                :title="$t('general.delete')"
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
      <primary-button
        @click="openCreateModal"
        class="mt-4"
      >
        {{ $t('patients.add-first-record') }}
      </primary-button>
    </div>

    <!-- Modal de detalles -->
    <consultation-details-modal
      v-if="showDetailsModal"
      :record="selectedRecord"
      :is-open="showDetailsModal"
      @close="closeDetailsModal"
      @view-recipe="handleViewRecipe"
      @edit="editRecord"
    />

    <!-- Modal de formulario -->
    <medical-record-form-modal
      v-if="showFormModal"
      :is-open="showFormModal"
      :record="selectedRecordForEdit"
      :patient-id="currentPatientSelectedId || props.patientId"
      :is-editing="isEditing"
      @close="closeFormModal"
      @save="handleSaveRecord"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { usePatientsStore } from '@stores/patientsStore'
import { storeToRefs } from 'pinia'
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import ConsultationDetailsModal from './ConsultationDetailsModal.vue'
import MedicalRecordFormModal from './MedicalRecordFormModal.vue'

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['view-recipe'])

// Store
const patientsStore = usePatientsStore()
const { 
  currentPatientMedicalRecords, 
  isLoadingMedicalRecords,
  currentPatientSelectedId 
} = storeToRefs(patientsStore)

// Estados locales
const itemsPerPage = ref(10)
const currentPage = ref(1)
const showDetailsModal = ref(false)
const showFormModal = ref(false)
const selectedRecord = ref(null)
const selectedRecordForEdit = ref(null)
const isEditing = ref(false)

// Computados para paginación
const totalRecords = computed(() => currentPatientMedicalRecords.value?.length || 0)
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value))
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return currentPatientMedicalRecords.value?.slice(start, end) || []
})

// Métodos para modales
async function openRecordDetails(record) {
  try {
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

function openCreateModal() {
  selectedRecordForEdit.value = null
  isEditing.value = false
  showFormModal.value = true
}

async function editRecord(record) {
  try {
    console.log('Editando registro:', record)
    
    // Usar el registro actual directamente (ya tiene los datos necesarios)
    selectedRecordForEdit.value = record
    isEditing.value = true
    showFormModal.value = true
    
    console.log('Estados del modal:', {
      showFormModal: showFormModal.value,
      isEditing: isEditing.value,
      selectedRecordForEdit: selectedRecordForEdit.value
    })
    
    // Cerrar modal de detalles si está abierto
    showDetailsModal.value = false
  } catch (error) {
    console.error('Error al preparar edición:', error)
    alert('Error al abrir el formulario de edición')
  }
}

function closeFormModal() {
  console.log('Cerrando modal de formulario')
  showFormModal.value = false
  selectedRecordForEdit.value = null
  isEditing.value = false
}

async function handleSaveRecord(formData) {
  try {
    console.log('Guardando registro:', formData)
    
    if (isEditing.value && selectedRecordForEdit.value) {
      // Actualizar registro existente
      console.log('Actualizando registro ID:', selectedRecordForEdit.value.id)
      await patientsStore.updateMedicalRecord(selectedRecordForEdit.value.id, formData)
    } else {
      // Crear nuevo registro
      console.log('Creando nuevo registro para paciente:', props.patientId)
      await patientsStore.createMedicalRecord(props.patientId, formData)
    }
    
    // Cerrar modal y recargar datos
    closeFormModal()
    await patientsStore.fetchPatientMedicalRecords(props.patientId)
    
    alert(isEditing.value ? 'Registro actualizado correctamente' : 'Registro creado correctamente')
  } catch (error) {
    console.error('Error al guardar registro:', error)
    alert('Error al guardar el registro: ' + (error.message || 'Error desconocido'))
  }
}

async function deleteRecord(record) {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro médico?')) return
  
  try {
    await patientsStore.deleteMedicalRecord(record.id)
    await patientsStore.fetchPatientMedicalRecords(props.patientId)
    alert('Registro eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar registro:', error)
    alert('Error al eliminar el registro')
  }
}

function downloadRecord(record) {
  // Implementar descarga de PDF
  console.log('Descargar registro:', record)
}

function handleViewRecipe(recipe) {
  emit('view-recipe', recipe)
  closeDetailsModal()
}

function resetPagination() {
  currentPage.value = 1
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