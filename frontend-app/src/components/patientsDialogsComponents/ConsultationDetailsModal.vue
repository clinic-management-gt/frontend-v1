<template>
  <general-dialog-modal
    ref="createDialog"
    :isOpen="isOpen"
    dialogSize="max-w-7xl"
    @close-modal="handleClose"
  >
    <!-- Header -->
    <template #title>
      <div class="flex justify-between items-center px-6 py-2 border-b">
        <div>
          <h2 class="text-2xl font-bold">
            {{ $t("patients.consult-detail") }}
          </h2>
          <!-- ✅ Debug info -->
          <div class="text-xs text-gray-500 mt-1">
            Selected ID: {{ selectedRecord?.id }} | Has fullRecord: {{ !!fullRecord }}
          </div>
        </div>
        <button
          class="text-black hover:text-gray-400 text-3xl font-bold leading-none"
          @click="handleClose"
        >
          ×
        </button>
      </div>
    </template>

    <!-- Body -->
    <template #body>
      <div class="overflow-y-auto max-h-[calc(95vh-160px)]">
        <!-- ✅ Debug display -->
        <div class="bg-yellow-50 p-2 text-xs border-b">
          <strong>Debug:</strong> 
          displayRecord: {{ displayRecord ? 'EXISTS' : 'NULL' }} |
          isLoading: {{ isLoadingMedicalRecords }} |
          hasError: {{ hasError }} |
          selectedRecord.id: {{ selectedRecord?.id }}
        </div>

        <!-- Loading -->
        <div
          v-if="isLoadingMedicalRecords || isLoadingDetails"
          class="flex flex-col justify-center items-center py-16"
        >
          <div
            class="animate-spin h-12 w-12 border-4 border-gray-300 border-t-[#489FB5] rounded-full"
          ></div>
          <p class="mt-4 text-gray-600">
            {{ $t("general.loading") }}...
          </p>
        </div>
        
        <!-- Content -->
        <div
          v-else-if="displayRecord"
          class="p-6 space-y-6"
        >
          <div class="bg-gray-100 rounded-lg p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">
              {{ $t("general.general-info") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t("general.date") }}:</span>
                <span class="text-gray-800 font-medium">
                  {{ formatDateShortest(displayRecord.medicalRecord.createdAt) }}
                </span>
              </div>
              <div>
                <span class="text-sm text-gray-600 font-semibold">{{ $t("general.status") }}:</span>
                <span
                  class="inline-block px-3 py-1 text-sm font-bold rounded-full text-white"
                  style="background-color: #48c9b0"
                >
                  {{ displayRecord.status || "Completado" }}
                </span>
              </div>
              <div v-if="displayRecord.diagnosis">
                <span class="text-sm text-gray-600 font-semibold">{{ $t("general.diagnosis") }}:</span>
                <p class="text-gray-800 font-medium">
                  {{ displayRecord.diagnosis }}
                </p>
              </div>
              <div v-if="displayRecord.weight">
                <span class="text-sm text-gray-600 font-semibold">{{ $t("patients.weight") }}:</span>
                <p class="text-gray-800 font-medium">
                  {{ displayRecord.weight }} kg
                </p>
              </div>
              <div v-if="displayRecord.height">
                <span class="text-sm text-gray-600 font-semibold">{{ $t("patients.height") }}:</span>
                <p class="text-gray-800 font-medium">
                  {{ displayRecord.height }} cm
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="displayRecord.familyHistory"
            class="bg-gray-100 rounded-lg p-4"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-4 h-4 rounded-full mr-2"
                style="background-color: #9b59b6"
              ></div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ $t("patients.family-history") }}
              </h3>
            </div>
            <div
              class="bg-white rounded p-3 border-l-4"
              style="border-color: #9b59b6"
            >
              <p class="text-gray-800 whitespace-pre-line">
                {{ displayRecord.familyHistory }}
              </p>
            </div>
          </div>

          <!-- Nota de evolución - Modificada para ocupar todo el ancho de la pantalla -->
          <div class="bg-gray-100 rounded-lg p-4 w-full">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-2"
                  style="background-color: #489fb5"
                ></div>
                <h3 class="text-lg font-bold text-gray-800">
                  {{ $t("patients.evolution-note") }}
                </h3>
                <span class="ml-2 text-sm text-gray-500">
                  {{ displayRecord?.updatedAt ? formatDate(displayRecord.updatedAt) : (displayRecord?.createdAt ? formatDate(displayRecord.createdAt) : '') }}
                </span>
              </div>
              <button
                class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium rounded flex items-center gap-1"
                @click="editEvolutionNote"
              >
                ✏️ {{ $t("general.edit") }}
              </button>
            </div>
            <div
              v-if="displayRecord.notes && displayRecord.notes.trim()"
              class="bg-white rounded p-5 border-l-4 min-h-[300px]"
              style="border-color: #489fb5"
            >
              <p class="text-gray-800 whitespace-pre-line">
                {{ displayRecord.notes }}
              </p>
            </div>
            <div
              v-else-if="
                displayRecord.medicalRecord?.notes &&
                  displayRecord.medicalRecord.notes.trim()
              "
              class="bg-white rounded p-5 border-l-4 min-h-[300px]"
              style="border-color: #489fb5"
            >
              <p class="text-gray-800 whitespace-pre-line">
                {{ displayRecord.medicalRecord.notes }}
              </p>
            </div>
            <div
              v-else
              class="text-center py-6 min-h-[300px] flex flex-col items-center justify-center"
            >
              <div class="text-gray-400 text-4xl mb-2">
                📝
              </div>
              <p class="text-gray-500">
                {{ $t("patients.no-evolution-note") }}
              </p>
              <button
                class="mt-3 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                @click="editEvolutionNote"
              >
                ✏️ {{ $t("general.edit") }}
              </button>
            </div>
          </div>

          <!-- Recetas médicas -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-2"
                  style="background-color: var(--primary-color)"
                ></div>
                <h3 class="text-lg font-bold text-gray-800">
                  {{ $t("patients.medical-recipe") }}
                </h3>
              </div>
            </div>
            <div
              v-if="displayRecord.recipes && displayRecord.recipes.length > 0"
              class="space-y-3"
            >
              <div
                v-for="recipe in displayRecord.recipes"
                :key="recipe.id"
                class="bg-white rounded-lg p-4 border relative"
              >
                <button
                  class="absolute top-3 right-3 px-2 py-1 text-green-600 hover:text-green-800 text-sm font-medium rounded flex items-center gap-1"
                  title="Editar receta"
                  @click="openRecipeFormModal(recipe)"
                >
                  ✏️ Editar
                </button>
                <div class="text-sm text-gray-600 mb-2 font-semibold pr-16">
                  📅 {{ formatDate(recipe.createdAt) }}
                </div>
                <div class="bg-gray-50 rounded p-3 mb-3">
                  <pre
                    class="text-gray-800 text-sm whitespace-pre-wrap font-mono"
                  >{{ recipe.prescription }}</pre>
                </div>
                <button
                  class="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style="background-color: var(--primary-color)"
                  @click="viewFullRecipe(recipe)"
                >
                  {{ $t("patients.view-full-recipe") }}
                </button>
              </div>
            </div>
            <div
              v-else
              class="text-center py-6"
            >
              <div class="text-gray-400 text-4xl mb-2">
                💊
              </div>
              <p class="text-gray-500">
                {{ $t("patients.no-prescription") }}
              </p>
              <button
                class="mt-3 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                @click="openRecipeFormModal()"
              >
                ✏️ {{ $t("general.edit") }}
              </button>
            </div>
          </div>

          <!-- Exámenes -->
          <div
            v-if="displayRecord.exams && displayRecord.exams.length > 0"
            class="bg-gray-100 rounded-lg p-4"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-4 h-4 rounded-full mr-2"
                style="background-color: #f4a261"
              ></div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ $t("patients.exams") }}
              </h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="exam in displayRecord.exams"
                :key="exam.id"
                class="bg-white rounded-lg p-4 border"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">
                    {{ exam.exam?.name || exam.name || "Examen" }}
                  </h4>
                  <span
                    class="text-xs px-2 py-1 rounded-full text-white font-semibold"
                    style="background-color: #f4a261"
                  >
                    {{ formatDate(exam.createdAt) }}
                  </span>
                </div>
                <div
                  v-if="exam.exam?.description"
                  class="text-sm text-gray-600 mb-2"
                >
                  <strong>Descripción:</strong> {{ exam.exam.description }}
                </div>
                <div
                  v-if="exam.resultText"
                  class="bg-gray-50 rounded p-3 mb-2"
                >
                  <div class="text-sm text-gray-600 mb-1 font-semibold">
                    Resultados:
                  </div>
                  <p class="text-gray-800 whitespace-pre-line">
                    {{ exam.resultText }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tratamientos -->
          <div
            v-if="
              displayRecord.treatments && displayRecord.treatments.length > 0
            "
            class="bg-gray-100 rounded-lg p-4"
          >
            <div class="flex items-center mb-3">
              <div
                class="w-4 h-4 rounded-full mr-2"
                style="background-color: #48c9b0"
              ></div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ $t("patients.treatments") }}
              </h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="treatment in displayRecord.treatments"
                :key="treatment.id"
                class="bg-white rounded-lg p-4 border"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-800">
                    {{ treatment.medicine?.name || "Medicamento" }}
                  </h4>
                  <span
                    class="text-xs px-2 py-1 rounded-full text-white font-semibold"
                    style="background-color: #48c9b0"
                  >
                    {{ formatDate(treatment.createdAt) }}
                  </span>
                </div>
                <div
                  class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2"
                >
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
                <div
                  v-if="treatment.medicine?.type"
                  class="text-sm text-gray-600 mb-2"
                >
                  <strong>Tipo:</strong> {{ treatment.medicine.type }}
                </div>
                <div
                  v-if="treatment.observations"
                  class="bg-gray-50 rounded p-3"
                >
                  <div class="text-sm text-gray-600 mb-1 font-semibold">
                    Observaciones:
                  </div>
                  <p class="text-gray-800">
                    {{ treatment.observations }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="hasError"
          class="text-center py-16"
        >
          <div class="text-red-500 text-6xl mb-4">
            ⚠️
          </div>
          <h3 class="text-xl font-bold text-red-600 mb-2">
            {{ $t("general.error-loading-data") }}
          </h3>
          <p class="text-gray-600 mb-6">
            No se pudieron cargar los detalles de la consulta
          </p>
          <button
            class="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style="background-color: #489fb5"
            @click="loadFullRecord"
          >
            {{ $t("general.retry") }}
          </button>
        </div>

        <!-- ✅ Estado vacío -->
        <div
          v-else
          class="text-center py-16"
        >
          <div class="text-gray-400 text-6xl mb-4">
            📋
          </div>
          <h3 class="text-xl font-bold text-gray-600 mb-2">
            No hay registro seleccionado
          </h3>
          <p class="text-gray-500">
            Selecciona un registro médico para ver sus detalles
          </p>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #buttons>
      <primary-button
        class="mr-2"
        bgColor="orange"
        @click="editRecord"
      >
        <p class="uppercase">
          {{ $t("general.edit") }}
        </p>
      </primary-button>
      <primary-button @click="downloadRecord">
        <p class="uppercase">
          {{ $t("general.download") }}
        </p>
      </primary-button>
    </template>
  </general-dialog-modal>
  
  <recipe-form-modal
    v-if="showRecipeFormModal"
    :isOpen="showRecipeFormModal"
    :recipe="selectedRecipeForEdit"
    :isEditing="isEditingRecipe"
    :treatmentId="displayRecord?.medicalRecord?.id"
    @close="closeRecipeModal"
    @save="(recipeData) => recipeStore.handleRecipeSave(recipeData, props.patientId, selectedRecord?.id)"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRecipeStore } from "@stores/recipeStore";
import { useMedicalRecordStore } from "@stores/medicalRecordStore";
import { storeToRefs } from "pinia";
import { formatDateShortest, formatDate } from "@/utils/isoFormatDate.js";
import { nextTick } from "vue";

import PrimaryButton from "@components/forms/PrimaryButton.vue";
import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import RecipeFormModal from "../patientsDialogsComponents/RecipeFormModal.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "view-recipe", "edit", "download"]);

const recipeStore = useRecipeStore();
const medicalRecordStore = useMedicalRecordStore();

const { fullRecord, selectedRecord, isLoadingMedicalRecords, hasError } = storeToRefs(medicalRecordStore);

const { 
  showRecipeFormModal, 
  selectedRecipeForEdit, 
  isEditingRecipe 
} = storeToRefs(recipeStore);

const {
  closeMedicalRecordModals,
  openMedicalRecordEditModal,
} = medicalRecordStore;

const { openRecipeFormModal, closeRecipeModal } = recipeStore;

const handleClose = () => {
  closeMedicalRecordModals();
};

const displayRecord = computed(() => {
  return fullRecord.value;
});

const isLoadingDetails = ref(false);

async function loadFullRecord() {
  if (!selectedRecord.value?.id) {
    return;
  }

  if (isLoadingDetails.value) {
    return;
  }
  
  isLoadingDetails.value = true;
  try {
    await medicalRecordStore.fetchMedicalRecordDetails(selectedRecord.value.id);
  } finally {
    isLoadingDetails.value = false;
  }
}

function editRecord() {
  emit("edit", displayRecord.value);
}

function editEvolutionNote() {
  handleClose();
  nextTick(() => {
    openMedicalRecordEditModal(displayRecord.value);
  });
}

function viewFullRecipe(recipe) {
  emit("view-recipe", recipe);
}

function downloadRecord() {
  emit("download", displayRecord.value);
}

const lastLoadedRecordId = ref(null);

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      if (currentRecordId !== lastLoadedRecordId.value) {
        lastLoadedRecordId.value = currentRecordId;
        await loadFullRecord();
      }
    } else {
      medicalRecordStore.clearFullRecord();
      lastLoadedRecordId.value = null;
    }
  },
);

watch(
  () => selectedRecord.value?.id,
  async (newRecordId, oldRecordId) => {
    if (props.isOpen && newRecordId && newRecordId !== oldRecordId) {
      lastLoadedRecordId.value = newRecordId;
      await loadFullRecord();
    }
  }
);
</script>
