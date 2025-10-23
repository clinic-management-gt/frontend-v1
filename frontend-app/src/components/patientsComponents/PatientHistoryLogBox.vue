<template>
  <div>
    <!-- Header con botón de agregar -->
    <div class="flex justify-between items-center">
      <p class="text-2xl font-bold">
        {{ $t("patients.patient-history") }}
      </p>

      <!-- Botón para agregar nuevo registro -->
      <div class="flex align-center items-center">
        <action-button-solid-icon
          icon="PlusIcon"
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
        @click="handleOpenDetails(item)"
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
                  {{ formatDateShort(item.date || item.createdAt) }}
                </p>
              </div>
              <p
                v-if="item.medicalRecord?.notes"
                class="text-sm text-gray-600 ml-5"
              >
                <strong>{{ $t("medical-records.notes") }}:</strong> 
                {{ item.medicalRecord.notes.substring(0, 100) }}
                <span v-if="item.medicalRecord.notes.length > 100">...</span>
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2">
              <action-button-solid-icon
                icon="EyeIcon"
                size="h-8 w-8"
                color="text-gray-500"
                @click.stop="handleOpenDetails(item)"
              />

              <action-button-solid-icon
                icon="PencilSquareIcon"
                size="h-8 w-8"
                color="text-gray-500"
                @click.stop="openMedicalRecordEditModal(item)"
              />

              <action-button-solid-icon
                icon="TrashIcon"
                size="h-8 w-8"
                color="text-red-600"
                @click.stop="deleteRecord(item)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Selector de items por página -->
      <div class="flex items-center gap-2 mt-4">
        <label class="text-sm text-gray-600">{{ $t("general.show") }}:</label>
        <select
          v-model="itemsPerPage"
          class="px-2 py-1 border rounded text-sm"
          @change="resetPagination"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        <span class="text-sm text-gray-600">{{ $t("general.elements") }}</span>
      </div>

      <!-- Controles de paginación -->
      <div
        v-if="totalPages > 1"
        class="flex justify-between items-center mt-4 text-sm text-gray-600"
      >
        <button
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToPreviousPage"
        >
          {{ $t("general.previous") }}
        </button>

        <span>
          {{ $t("general.page") }} {{ currentPage }}
          {{ $t("general.of") }} {{ totalPages }}
        </span>

        <button
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
          @click="goToNextPage"
        >
          {{ $t("general.next") }}
        </button>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-else
      class="flex flex-col w-full align-center items-center text-center py-12"
    >
      <document-text-icon class="text-patient-page-color w-9 h-9" />
      <p class="text-gray-500 text-lg">
        {{ $t("patients.no-medical-records") }}
      </p>
    </div>

    <!-- Modal de detalles -->
    <consultation-details-modal
      :isOpen="showDetailsModal"
      @close="closeMedicalRecordModals"
      @view-recipe="handleViewRecipe"
      @edit="openMedicalRecordEditModal"
    />

    <!-- Modal de formulario -->
    <medical-record-form-modal
      v-if="showFormModal"
      :isOpen="showFormModal"
      :patientId="patientId"
      :record="selectedRecordForEdit"
      @close="handleFormModalClose"
      @save="handleFormModalSave"
    />

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ $t("general.confirm-deletion") }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ $t("general.delete-confirmation-message") }}
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            @click="cancelDelete"
          >
            {{ $t("general.cancel") }}
          </button>
          <button
            class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            @click="confirmDelete"
          >
            {{ $t("general.delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useMedicalRecordStore } from "@stores/medicalRecordStore";
import { storeToRefs } from "pinia";
import { 
  DocumentTextIcon 
} from "@heroicons/vue/24/outline";

import ActionButtonSolidIcon from "@components/forms/ActionButtonOutlinedIcon.vue";
import ConsultationDetailsModal from "../patientsDialogsComponents/ConsultationDetailsModal.vue";
import MedicalRecordFormModal from "../patientsDialogsComponents/MedicalRecordFormModal.vue";
import { formatDateShort } from "@/utils/isoFormatDate.js";

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["view-recipe"]);

const medicalRecordStore = useMedicalRecordStore();
const { currentPatientMedicalRecords } = storeToRefs(medicalRecordStore);

const {
  showFormModal,
  showDetailsModal,
  selectedRecordForEdit,
} = storeToRefs(medicalRecordStore);

const {
  openRecordDetailsDialog,
  openCreateModal,
  closeMedicalRecordModals,
  openMedicalRecordEditModal,
  setSelectedRecord,
} = medicalRecordStore;

const recordToDelete = ref(null);
const showDeleteConfirmation = ref(false);

const itemsPerPage = ref(5);
const currentPage = ref(1);

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

function handleOpenDetails(record) {
  setSelectedRecord(record);
  openRecordDetailsDialog(record);
}

function deleteRecord(record) {
  recordToDelete.value = record;
  showDeleteConfirmation.value = true;
}

function cancelDelete() {
  recordToDelete.value = null;
  showDeleteConfirmation.value = false;
}

async function confirmDelete() {
  if (!recordToDelete.value) return;

  await medicalRecordStore.deleteMedicalRecordById(recordToDelete.value.id);
  await medicalRecordStore.fetchPatientMedicalRecords(props.patientId);
  
  cancelDelete();
}

function handleViewRecipe(recipe) {
  emit("view-recipe", recipe);
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

const lastLoadedPatientId = ref(null);

onMounted(async () => {
  if (props.patientId && props.patientId !== lastLoadedPatientId.value) {
    lastLoadedPatientId.value = props.patientId;
    await medicalRecordStore.fetchPatientMedicalRecords(props.patientId);
  }
});

watch(
  () => props.patientId,
  async (newId, oldId) => {
    if (newId && newId !== oldId && newId !== lastLoadedPatientId.value) {
      currentPage.value = 1;
      lastLoadedPatientId.value = newId;
      await medicalRecordStore.fetchPatientMedicalRecords(newId);
    }
  },
  { immediate: false }
);

// ✅ Handler para cerrar el modal de formulario
function handleFormModalClose() {
  closeMedicalRecordModals();
}

// ✅ Handler para cuando se guarda exitosamente
async function handleFormModalSave() {
  await medicalRecordStore.fetchPatientMedicalRecords(props.patientId);
  closeMedicalRecordModals();
}
</script>
