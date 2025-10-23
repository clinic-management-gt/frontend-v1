<template>
  <div class="">
    <!-- Header con botón de agregar -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ $t("patients.history-log") }}
      </h2>
        <action-button-solid-icon
          icon="PlusCircleIcon"
          size="h-10 w-10"
          color="text-patient-page-color"
          :click="openCreateModal()"/>
    </div>

    <!-- Lista de registros -->
    <div class="space-y-4">
      <div
        v-for="record in paginatedRecords"
        :key="`record-${record.id}-${record.medicalRecord?.id || 'new'}`"
        class="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 bg-gray-50"
      >
        <div class="flex justify-between items-start gap-4">
          <!-- Contenido del registro -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-shrink-0 w-10 h-10 bg-[#489FB5] rounded-full flex items-center justify-center">
                <DocumentTextIcon class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-lg">
                  {{ $t("patients.consult") }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDateShort(record.date) }}
                </p>
              </div>
            </div>
            
            <!-- Notas del registro -->
            <div
              v-if="record.medicalRecord?.notes"
              class="mt-3 pl-13 text-sm text-gray-700 line-clamp-2"
            >
              <span class="font-medium text-gray-900">{{ $t("medical-records.notes") }}:</span>
              {{ record.medicalRecord.notes }}
            </div>

            <!-- Peso y Altura -->
            <div
              v-if="record.medicalRecord?.weight || record.medicalRecord?.height"
              class="mt-2 pl-13 flex gap-4 text-sm text-gray-600"
            >
              <span v-if="record.medicalRecord?.weight">
                <span class="font-medium">{{ $t("medical-records.weight") }}:</span>
                {{ record.medicalRecord.weight }} kg
              </span>
              <span v-if="record.medicalRecord?.height">
                <span class="font-medium">{{ $t("medical-records.height") }}:</span>
                {{ record.medicalRecord.height }} cm
              </span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-2 flex-shrink-0">
            <button
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group relative"
              @click="handleOpenDetails(record)"
            >
          </button>
          <action-button-solid-icon
                          icon="EyeIcon"
                           @click="handleOpenDetails(record)"
                          size="h-6 w-6"
                        />
          <EyeIcon class="w-5 h-5" />
          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {{ $t("general.view") }}
          </span>
            <button
              class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors group relative"
              @click="openMedicalRecordEditModal(record)"
            >
              <PencilIcon class="w-5 h-5" />
              <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ $t("general.edit") }}
              </span>
            </button>
            <button
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
              @click="deleteRecord(record)"
            >
              <TrashIcon class="w-5 h-5" />
              <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ $t("general.delete") }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div
        v-if="!paginatedRecords || paginatedRecords.length === 0"
        class="text-center py-12"
      >
        <DocumentTextIcon class="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">
          {{ $t("patients.no-records") }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ $t("patients.no-records-description") }}
        </p>
        <button
          class="px-6 py-3 bg-[#489FB5] text-white rounded-lg hover:bg-[#3a8ca0] transition-colors shadow-sm font-medium"
          @click="openCreateModal"
        >
          {{ $t("patients.create-first-record") }}
        </button>
      </div>
    </div>

    <!-- Paginación -->
    <div
      v-if="totalPages > 1"
      class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
    >
      <button
        :disabled="currentPage === 1"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium text-gray-700"
        @click="goToPreviousPage"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t("general.previous") }}
      </button>
      
      <span class="text-sm font-medium text-gray-700">
        {{ $t("general.page") }} {{ currentPage }} {{ $t("general.of") }} {{ totalPages }}
      </span>
      
      <button
        :disabled="currentPage === totalPages"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium text-gray-700"
        @click="goToNextPage"
      >
        {{ $t("general.next") }}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <TrashIcon class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            {{ $t("general.confirm-delete") }}
          </h3>
        </div>
        <p class="text-gray-600 mb-6 ml-15">
          {{ $t("patients.confirm-delete-record") }}
        </p>
        <div class="flex gap-3 justify-end">
          <button
            class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            @click="cancelDelete"
          >
            {{ $t("general.cancel") }}
          </button>
          <button
            class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            @click="confirmDelete"
          >
            {{ $t("general.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <consultation-details-modal
      :isOpen="showDetailsModal"
      @close="closeMedicalRecordModals"
      @view-recipe="handleViewRecipe"
      @edit="openMedicalRecordEditModal"
      @download="downloadRecord"
    />

    <medical-record-form-modal
      v-if="showFormModal"
      :isOpen="showFormModal"
      :patientId="patientId"
      :record="selectedRecordForEdit"
      @close="closeMedicalRecordModals"
      @save="async () => {
        await medicalRecordStore.fetchPatientMedicalRecords(patientId);
        closeMedicalRecordModals();
      }"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useMedicalRecordStore } from "@stores/medicalRecordStore";
import { storeToRefs } from "pinia";
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  DocumentTextIcon 
} from "@heroicons/vue/24/outline";

import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";
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
  isEditing,
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
  console.log("📋 Abriendo detalles para record:", record);
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

function downloadRecord() {
  // TODO: Implementar funcionalidad de descarga de PDF
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
</script>
