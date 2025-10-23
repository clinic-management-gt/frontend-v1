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
          class="space-y-2"
        >
          <div class="bg-gray-100 rounded-lg p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-3">
              {{ $t("general.general-info") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <span class="text-sm text-gray-600 font-semibold mr-3">{{ $t("general.date") }}:</span>
                <span class="text-gray-800 font-medium">
                  {{ formatDateShortest(displayRecord.medicalRecord.createdAt) }}
                </span>
              </div>
              <div>
                <span class="text-sm text-gray-600 font-semibold mr-3">{{ $t("general.status") }}:</span>
                <span
                  class="inline-block px-3 py-1 text-sm font-bold rounded-full text-white"
                  style="background-color: #48c9b0"
                >
                  {{ displayRecord.medicalRecord.status || "Completado" }}
                </span>
              </div>
              <div v-if="displayRecord.medicalRecord.diagnosis">
                <span class="text-sm text-gray-600 font-semibold mr-3">{{ $t("general.diagnosis") }}:</span>
                <span class="text-gray-800 font-medium">
                  {{ displayRecord.medicalRecord.diagnosis }}
                </span>
              </div>
              <div v-if="displayRecord.medicalRecord.weight">
                <span class="text-sm text-gray-600 font-semibold mr-3">{{ $t("patients.weight") }}:</span>
                <span class="text-gray-800 font-medium">
                  {{ displayRecord.medicalRecord.weight }} kg
                </span>
              </div>
              <div v-if="displayRecord.medicalRecord.height">
                <span class="text-sm text-gray-600 font-semibold mr-3">{{ $t("patients.height") }}:</span>
                <span class="text-gray-800 font-medium">
                  {{ displayRecord.medicalRecord.height }} cm
                </span>
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
                <document-icon class="h-10 w-10" />
              </div>
              <p class="text-gray-500">
                {{ $t("patients.no-evolution-note") }}
              </p>
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
              v-if="displayRecord.treatments && displayRecord.treatments.length > 0"
              class="space-y-3"
            >
              <div
                v-for="recipe in displayRecord.treatments"
                :key="recipe.id"
                class="bg-white rounded-lg p-4 border relative"
              >
                <div class="bg-gray-50 rounded p-3 mb-3">
                  <pre
                    class="text-gray-800 text-sm whitespace-pre-wrap font-mono"
                  >{{ recipe.prescription }}</pre>
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-center py-6"
            >
              <div class="text-gray-400 text-4xl mb-2">
                <document-icon class="h-10 w-10 mx-auto" />
              </div>
              <p class="text-gray-500">
                {{ $t("patients.no-prescription") }}
              </p>
            </div>
          </div>

          <!-- Documents UNIFICADA -->
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div
                class="w-4 h-4 rounded-full mr-2"
                style="background-color: var(--document-color)"
              ></div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ $t("general.documents") }}
              </h3>
            </div>
            <div
              v-if="organizedDocuments && organizedDocuments.all.length > 0"
              class="bg-gray-100 rounded-lg p-4"
            >
              <div class="flex items-center mb-4">
                <div
                  class="w-4 h-4 rounded-full mr-2"
                  style="background-color: #3498db"
                ></div>
                <h3 class="text-lg font-bold text-gray-800">
                  {{ $t("general.documents") }}
                </h3>
              </div>
            
              <template
                v-for="(category, categoryKey) in [
                  { key: 'laboratories', label: 'files.laboratory', icon: BeakerIcon, color: 'text-red-600' },
                  { key: 'exams', label: 'files.exam', icon: ClipboardDocumentCheckIcon, color: 'text-orange-600' },
                  { key: 'general', label: 'files.general-document', icon: DocumentTextIcon, color: 'text-blue-600' }
                ]"
                :key="categoryKey"
              >
                <div
                  v-if="organizedDocuments[category.key].length > 0"
                  class="mb-4"
                >
                  <h4 class="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <component
                      :is="category.icon"
                      class="h-5 w-5"
                      :class="category.color"
                    />
                    {{ $t(category.label) }} ({{ organizedDocuments[category.key].length }})
                  </h4>
              
                  <div class="space-y-2">
                    <div
                      v-for="doc in organizedDocuments[category.key]"
                      :key="doc.id"
                      class="bg-white rounded-lg p-4 border-l-4 flex justify-between items-start hover:shadow-md transition-shadow"
                      :style="{ borderColor: fileStore.getDocumentTypeColor(doc.type) }"
                    >
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <component
                            :is="getIconComponent(doc.type)"
                            class="h-5 w-5"
                            :style="{ color: fileStore.getDocumentTypeColor(doc.type) }"
                          />
                          <h5 class="font-bold text-gray-800">
                            {{ fileStore.getDocumentTypeLabel(doc.type) }}
                          </h5>
                        </div>
                        <p
                          v-if="doc.description"
                          class="text-sm text-gray-600 mb-2"
                        >
                          <strong>{{ $t('general.description') }}:</strong> {{ doc.description }}
                        </p>
                      </div>
                    
                      <div class="flex gap-2 ml-4">
                        <button
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group relative"
                          :title="$t('files.view-file')"
                          @click="handleViewDocument(doc)"
                        >
                          <document-icon class="h-5 w-5" />
                          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {{ $t('files.view-file') }}
                          </span>
                        </button>
                        <button
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors group relative"
                          :title="$t('files.download-file')"
                          @click="handleDownloadDocument(doc)"
                        >
                          <calendar-icon class="h-5 w-5 rotate-180" />
                          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {{ $t('files.download-file') }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div
              v-else
            >
              <div class="text-center py-6">
                <div class="text-gray-400 text-4xl mb-2">
                  <document-icon class="h-10 w-10 mx-auto" />
                </div>
                <p class="text-gray-500">
                  {{ $t("files.no-documents") }}
                </p>
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
            {{ $t('medical-records.error-loading-consultation-details') }}
          </p>
          <button
            class="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style="background-color: #489fb5"
            @click="loadFullRecord"
          >
            {{ $t("general.retry") }}
          </button>
        </div>

        <!-- Estado vacío -->
        <div
          v-else
          class="text-center py-16"
        >
          <div class="text-gray-400 text-6xl mb-4">
            <folder-open-icon class="h-16 w-16 mx-auto" />
          </div>
          <h3 class="text-xl font-bold text-gray-600 mb-2">
            {{ $t('medical-records.no-records') }}
          </h3>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #buttons>
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
import { useFileStore } from "@stores/fileStore";
import { 
  DocumentIcon, 
  FolderOpenIcon, 
  CalendarIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { formatDateShortest, formatDate } from "@/utils/isoFormatDate.js";

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
const fileStore = useFileStore();

const { fullRecord, selectedRecord, isLoadingMedicalRecords, hasError } = storeToRefs(medicalRecordStore);

const { 
  showRecipeFormModal, 
  selectedRecipeForEdit, 
  isEditingRecipe 
} = storeToRefs(recipeStore);

const {
  closeMedicalRecordModals,
} = medicalRecordStore;

const { openRecipeFormModal, closeRecipeModal } = recipeStore;

const organizedDocuments = computed(() => {
  if (!fullRecord.value?.documents) return null;
  return fileStore.organizeDocumentsByType(fullRecord.value.documents);
});

const getIconComponent = (type) => {
  const iconName = fileStore.getDocumentTypeIcon(type);
  const iconMap = {
    'BeakerIcon': BeakerIcon,
    'ClipboardDocumentCheckIcon': ClipboardDocumentCheckIcon,
    'DocumentTextIcon': DocumentTextIcon,
    'DocumentIcon': DocumentIcon,
  };
  return iconMap[iconName] || DocumentIcon;
};

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

function viewFullRecipe(recipe) {
  emit("view-recipe", recipe);
}

function downloadRecord() {
  emit("download", displayRecord.value);
}

function handleDownloadDocument(doc) {
  const fileName = `${fileStore.getDocumentTypeLabel(doc.type)}_${doc.id}.pdf`;
  fileStore.downloadFile(doc.file, fileName);
}

function handleViewDocument(doc) {
  fileStore.viewFile(doc.file);
}

const lastLoadedRecordId = ref(null);

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await loadFullRecord();
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
