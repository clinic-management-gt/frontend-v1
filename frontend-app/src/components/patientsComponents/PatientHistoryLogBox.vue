<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <p class="text-2xl font-bold">{{ $t('patients.patient-history') }}</p>

      <!-- Botón para agregar nuevo registro -->
      <div class="flex align-center items-center ">
        <action-button-solid-icon icon="PlusCircleIcon" size="h-10 w-10" color="text-patient-page-color"
                @click="openCreateModal" />
      </div>
    </div>

    <!-- Lista de registros médicos -->
    <div v-if="paginatedRecords.length > 0">
      <div v-for="item in paginatedRecords" :key="item.id" class="mb-3 cursor-pointer" @click="openRecordDetails(item)" >
        <div class="bg-white shadow-md hover:bg-gray-200 rounded-lg p-4 transition-colors duration-200">
          <div class="flex justify-between items-center gap-2">
            <!-- Información principal -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-3 h-3 rounded-full" style="background-color: var(--primary-color);"></div>
                <p class="text-lg font-bold text-gray-800">
                  {{ formatDateShort(item.createdAt) }}
                </p>
              </div>
              <p v-if="item.diagnosis" class="text-sm text-gray-600 ml-5">
                <strong>Diagnóstico:</strong> {{ item.diagnosis }}
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2">
              <action-button-solid-icon icon="EyeIcon" size="h-8 w-8" color="text-patient-page-color"
                @click.stop="openRecordDetailsDialog(item)"  />

              <action-button-solid-icon icon="PencilIcon" size="h-8 w-8"  color="text-patient-page-color"
                @click.stop="openMedicalRecordEditModal(item)"  />

              <action-button-solid-icon icon="TrashIcon" size="h-8 w-8"  color="text-red-600"
                @click.stop="deleteRecord(item)"  />

              <action-button-solid-icon icon="ArrowDownTrayIcon" size="h-8 w-8"  color="text-patient-page-color"
              @click.stop="downloadRecord(item)"  />
            </div>
          </div>
        </div>
      </div>
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
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button @click="goToPreviousPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded disabled:opacity-50">
          {{ $t('general.previous') || 'Anterior' }}
        </button>

        <span>
          {{ $t('general.page') || 'Página' }} {{ currentPage }} {{ $t('general.of') || 'de' }} {{ totalPages }}
        </span>

        <button @click="goToNextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded disabled:opacity-50">
          {{ $t('general.next') || 'Siguiente' }}
        </button>
      </div>
    </div>


    <!-- Estado vacío -->
    <div v-else class="flex flex-col w-full min-h-screen align-center items-center text-center py-12">
      <document-icon  class="text-patient-page-color w-9 h-9"/>
      <p class="text-gray-500 text-lg">{{ $t('patients.no-medical-records') }}</p>
    </div>

    <!-- Modal de detalles -->
    <consultation-details-modal
      v-if="showDetailsModal" :record="selectedRecord" :is-open="showDetailsModal"
      @close="closeHistoryLogModals" @view-recipe="handleViewRecipe" @edit="openMedicalRecordEditModal" />

    <!-- Modal de formulario -->
    <medical-record-form-modal 
      v-if="showFormModal" 
      :is-open="showFormModal"
      :patient-id="currentPatientSelectedId || props.patientId"
      :record="selectedRecordForEdit"
      :is-editing="isEditing"
      @close="closeHistoryLogModals" 
      @save="(formData) => handleMedicalRecordSave(formData, props.patientId)" 
    />

    <!-- Modal de formulario de recetas -->
    <recipe-form-modal 
      v-if="showRecipeFormModal" 
      :is-open="showRecipeFormModal"
      :recipe="selectedRecipeForEdit"
      :is-editing="isEditingRecipe"
      :treatment-id="1"
      @close="closeHistoryLogModals" 
      @save="(recipeData) => handleRecipeSave(recipeData, props.patientId)" 
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { usePatientsStore } from '@stores/patientsStore'
import {usePatientsLogicStore} from '@stores/patientsLogicStore.js'
import { storeToRefs } from 'pinia'
import { DocumentIcon } from '@heroicons/vue/24/outline'

import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'
import ActionButtonOutlinedIcon from '@components/forms/ActionButtonOutlinedIcon.vue'
import PrimaryButton from '@components/forms/PrimaryButton.vue'
import Panel from '@components/forms/Panel.vue'
import ConsultationDetailsModal from '../patientsDialogsComponents/ConsultationDetailsModal.vue'
import MedicalRecordFormModal from '../patientsDialogsComponents/MedicalRecordFormModal.vue'
import RecipeFormModal from '../patientsDialogsComponents/RecipeFormModal.vue'
import { formatDateShort } from '@/utils/isoFormatDate.js'

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['view-recipe'])

// Store
const patientsStore = usePatientsStore()
const { currentPatientMedicalRecords, isLoadingMedicalRecords, currentPatientSelectedId } = storeToRefs(patientsStore)
const patientsLogicStore = usePatientsLogicStore()
const {showFormModal, showDetailsModal, showRecipeFormModal, selectedRecord, selectedRecordForEdit, selectedRecipeForEdit, isEditing, isEditingRecipe} = storeToRefs(patientsLogicStore)
const { openRecordDetailsDialog, openCreateModal, closeHistoryLogModals, openMedicalRecordEditModal, handleMedicalRecordSave, handleRecipeSave } = patientsLogicStore
// Estados locales
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Computados para paginación
const totalRecords = computed(() => currentPatientMedicalRecords.value?.length || 0)
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value))
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  if (!currentPatientMedicalRecords.value) return []

  const records = Object.values(currentPatientMedicalRecords.value)
  return records.slice(start, end)
})


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
function goToPreviousPage() {
  if (currentPage.value > 1) currentPage.value--
}
function goToNextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
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
