<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <p class="text-2xl font-bold">
        {{ $t("patients.patient-history") }}
      </p>

      <!-- Botón para agregar nuevo registro -->
      <div class="flex align-center items-center">
        <action-button-solid-icon
          icon="PlusCircleIcon"
          size="h-10 w-10"
          color="text-patient-page-color"
          @click="openCreateModal"
        />
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
        <div
          class="bg-white shadow-md hover:bg-gray-200 rounded-lg p-4 transition-colors duration-200"
        >
          <div class="flex justify-between items-center gap-2">
            <!-- Información principal -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <div
                  class="w-3 h-3 rounded-full"
                  style="background-color: var(--primary-color)"
                ></div>
                <p class="text-lg font-bold text-gray-800">
                  {{ formatDateShort(item.createdAt) }}
                </p>
              </div>
              <p
                v-if="item.diagnosis"
                class="text-sm text-gray-600 ml-5"
              >
                <strong>Diagnóstico:</strong> {{ item.diagnosis }}
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2">
              <action-button-solid-icon
                icon="EyeIcon"
                size="h-8 w-8"
                color="text-patient-page-color"
                @click.stop="openRecordDetailsDialog(item)"
              />

              <action-button-solid-icon
                icon="PencilIcon"
                size="h-8 w-8"
                color="text-patient-page-color"
                @click.stop="openMedicalRecordEditModal(item)"
              />

              <action-button-solid-icon
                icon="TrashIcon"
                size="h-8 w-8"
                color="text-red-600"
                @click.stop="deleteRecord(item)"
              />

              <action-button-solid-icon
                icon="ArrowDownTrayIcon"
                size="h-8 w-8"
                color="text-patient-page-color"
                @click.stop="downloadRecord(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">{{ $t("general.show") }}:</label>
        <select
          v-model="itemsPerPage"
          class="px-2 py-1 border rounded text-sm"
          @change="resetPagination"
        >
          <option value="5">
            5
          </option>
          <option value="10">
            10
          </option>
          <option value="15">
            15
          </option>
          <option value="20">
            20
          </option>
        </select>
        <span class="text-sm text-gray-600">{{ $t("general.elements") }}</span>
      </div>
      <div
        v-if="totalPages > 1"
        class="flex justify-between items-center mt-4 text-sm text-gray-600"
      >
        <button
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToPreviousPage"
        >
          {{ $t("general.previous") || "Anterior" }}
        </button>

        <span>
          {{ $t("general.page") || "Página" }} {{ currentPage }}
          {{ $t("general.of") || "de" }} {{ totalPages }}
        </span>

        <button
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToNextPage"
        >
          {{ $t("general.next") || "Siguiente" }}
        </button>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-else
      class="flex flex-col w-full min-h-screen align-center items-center text-center py-12"
    >
      <document-icon class="text-patient-page-color w-9 h-9" />
      <p class="text-gray-500 text-lg">
        {{ $t("patients.no-medical-records") }}
      </p>
    </div>

    <!-- Modal de detalles -->
    <consultation-details-modal
      v-if="showDetailsModal"
      :record="selectedRecord"
      :isOpen="showDetailsModal"
      @close="closeHistoryLogModals"
      @view-recipe="handleViewRecipe"
      @edit="openMedicalRecordEditModal"
    />

    <!-- Modal de formulario -->
    <medical-record-form-modal
      v-if="showFormModal"
      :isOpen="showFormModal"
      :patientId="currentPatientSelectedId || props.patientId"
      :record="selectedRecordForEdit"
      :isEditing="isEditing"
      @close="closeHistoryLogModals"
      @save="(formData) => handleMedicalRecordSave(formData, props.patientId)"
    />

    <!-- Modal de formulario de recetas -->
    <recipe-form-modal
      v-if="showRecipeFormModal"
      :isOpen="showRecipeFormModal"
      :recipe="selectedRecipeForEdit"
      :isEditing="isEditingRecipe"
      :treatmentId="getFirstTreatmentId()"
      @close="closeHistoryLogModals"
      @save="(recipeData) => handleRecipeSave(recipeData, props.patientId)"
    />

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Confirmar eliminación
        </h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar este registro médico? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            @click="cancelDelete"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            @click="confirmDelete"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { usePatientsStore } from "@stores/patientsStore";
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { storeToRefs } from "pinia";
import { DocumentIcon } from "@heroicons/vue/24/outline";

import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";
import ConsultationDetailsModal from "../patientsDialogsComponents/ConsultationDetailsModal.vue";
import MedicalRecordFormModal from "../patientsDialogsComponents/MedicalRecordFormModal.vue";
import RecipeFormModal from "../patientsDialogsComponents/RecipeFormModal.vue";
import { formatDateShort } from "@/utils/isoFormatDate.js";

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["view-recipe"]);

// Store
const patientsStore = usePatientsStore();
const {
  currentPatientMedicalRecords,
  currentPatientSelectedId,
} = storeToRefs(patientsStore);
const patientsLogicStore = usePatientsLogicStore();

// Estado para confirmación de eliminación
const recordToDelete = ref(null);
const showDeleteConfirmation = ref(false);
const {
  showFormModal,
  showDetailsModal,
  showRecipeFormModal,
  selectedRecord,
  selectedRecordForEdit,
  selectedRecipeForEdit,
  isEditing,
  isEditingRecipe,
} = storeToRefs(patientsLogicStore);
const {
  openRecordDetailsDialog,
  openCreateModal,
  closeHistoryLogModals,
  openMedicalRecordEditModal,
  handleMedicalRecordSave,
  handleRecipeSave,
} = patientsLogicStore;
// Estados locales
const itemsPerPage = ref(10);
const currentPage = ref(1);

// Computados para paginación
const totalRecords = computed(
  () => currentPatientMedicalRecords.value?.length || 0,
);
const totalPages = computed(() =>
  Math.ceil(totalRecords.value / itemsPerPage.value),
);
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  if (!currentPatientMedicalRecords.value) return [];

  const records = Object.values(currentPatientMedicalRecords.value);
  return records.slice(start, end);
});

/**
 * Inicia el proceso de eliminación mostrando modal de confirmación
 * @param {Object} record - Registro médico a eliminar
 */
function deleteRecord(record) {
  recordToDelete.value = record;
  showDeleteConfirmation.value = true;
}

/**
 * Cancela la eliminación del registro médico
 */
function cancelDelete() {
  recordToDelete.value = null;
  showDeleteConfirmation.value = false;
}

/**
 * Confirma y ejecuta la eliminación del registro médico
 */
async function confirmDelete() {
  if (!recordToDelete.value) return;

  await patientsStore.deleteMedicalRecord(recordToDelete.value.id);
  await patientsStore.fetchPatientMedicalRecords(props.patientId);
  
  // Cerrar modal
  cancelDelete();
}

function downloadRecord() {
  // TODO: Implementar funcionalidad de descarga de PDF
}

function handleViewRecipe(recipe) {
  emit("view-recipe", recipe);
}

function getFirstTreatmentId() {
  // Si estamos editando una receta existente, usar su treatmentId
  if (selectedRecipeForEdit.value?.treatmentId) {
    return selectedRecipeForEdit.value.treatmentId;
  }

  // Si hay registros médicos con tratamientos, buscar el primer tratamiento disponible
  if (currentPatientMedicalRecords.value) {
    const records = Object.values(currentPatientMedicalRecords.value);
    for (const record of records) {
      if (record.treatments && record.treatments.length > 0) {
        return record.treatments[0].id;
      }
    }
  }

  // Si no hay tratamientos, retornar null para indicar que no se puede crear receta
  return null;
}

function resetPagination() {
  currentPage.value = 1;
}
function goToPreviousPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function goToNextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// Cargar datos al montar el componente
onMounted(async () => {
  if (props.patientId) {
    await patientsStore.fetchPatientMedicalRecords(props.patientId);
  }
});

// Observar cambios en el ID del paciente
watch(
  () => props.patientId,
  async (newId) => {
    if (newId) {
      currentPage.value = 1;
      await patientsStore.fetchPatientMedicalRecords(newId);
    }
  },
);
</script>
