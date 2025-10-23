<template>
  <general-dialog-modal
    :isOpen="isOpen"
    dialogSize="max-w-4xl"
    :isChildrenOpen="false"
    @close-modal="handleClose"
  >
    <template #title>
      <p class="text-xl">
        {{
          $t(
            isEditing
              ? "medical-records.edit-record"
              : "medical-records.add-record",
          )
        }}
      </p>
    </template>
    <template #body>
      <div class="space-y-6 max-h-[70vh] overflow-y-auto">
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">
              {{ $t("medical-records.basic-info") }}
            </h3>

            <!-- Peso y Altura -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Peso -->
              <div>
                <div
                  v-if="isEditing && originalValues.weight"
                  class="mb-2 text-xs text-gray-500 bg-white p-2 rounded border"
                >
                  📊 {{ $t("medical-records.current-value") }}:
                  {{ originalValues.weight }} kg
                </div>
                <text-input
                  name="weight"
                  type="number"
                  step="0.1"
                  title="medical-records.weight"
                  inputPlaceholder="medical-records.weight-placeholder"
                  inputColor="patient-page-color"
                  labelCss="text-sm font-medium text-gray-700"
                />
              </div>

              <!-- Altura -->
              <div>
                <div
                  v-if="isEditing && originalValues.height"
                  class="mb-2 text-xs text-gray-500 bg-white p-2 rounded border"
                >
                  📊 {{ $t("medical-records.current-value") }}:
                  {{ originalValues.height }} cm
                </div>
                <text-input
                  name="height"
                  type="number"
                  step="0.1"
                  title="medical-records.height"
                  inputPlaceholder="medical-records.height-placeholder"
                  inputColor="patient-page-color"
                  labelCss="text-sm font-medium text-gray-700"
                />
              </div>
            </div>

            <!-- Antecedentes familiares -->
            <div class="mb-4">
              <textarea-input
                name="familyHistory"
                title="medical-records.family-history"
                inputPlaceholder="medical-records.family-history-placeholder"
                inputColor="patient-page-color"
                labelCss="text-sm font-medium text-gray-700"
                :rows="3"
              />
            </div>

            <!-- Notas de evolución -->
            <div class="mb-4">
              <textarea-input
                name="notes"
                title="medical-records.evolution-notes"
                inputPlaceholder="medical-records.evolution-notes-placeholder"
                inputColor="patient-page-color"
                labelCss="text-sm font-medium text-gray-700"
                :rows="4"
                :required="true"
              />
            </div>

            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-700">
                {{ $t("patients.medical-recipe") }}
              </h3>
              <div class="flex items-center">
                <input
                  id="includeRecipe"
                  v-model="includeRecipe"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label for="includeRecipe" class="ml-2 text-sm text-gray-700">
                  {{ $t("recipes.include-recipe") }}
                </label>
              </div>
            </div>

            <div v-if="includeRecipe" class="mb-4">
              <div class="mb-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-md">
                <p class="flex items-center">
                  <exclamation-triangle-icon class="w-5 h-5 mr-2 flex-shrink-0" />
                  {{ $t("recipes.warning-recipe-note") }}
                </p>
              </div>
              <textarea-input
                name="prescription"
                inputPlaceholder="recipes.prescription-placeholder"
                inputColor="patient-page-color"
                :rows="4"
              />
            </div>
          </div>

          <!-- Subir archivos -->
          <div class="mb-4 bg-gray-50 p-4 rounded-lg">
            <h4 class="block text-sm font-medium text-gray-700 mb-3">
              {{ $t("files.upload-file") }}
            </h4>

            <!-- Sección de Laboratorio -->
            <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-blue-900 flex items-center">
                  <DocumentTextIcon class="w-5 h-5 mr-2" />
                  {{ $t("files.upload-laboratory") }} ({{ $t("general.optional") }})
                </label>
                <span
                  v-if="fileStore.laboratoryFile"
                  class="text-xs text-green-600 font-medium flex items-center"
                >
                  <CheckIcon class="w-4 h-4 mr-1" />
                  {{ $t("files.file-selected") }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <input
                  ref="laboratoryInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  class="hidden"
                  @change="handleLaboratoryFileChange"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                  @click="$refs.laboratoryInput.click()"
                >
                  <ArrowUpTrayIcon class="w-4 h-4 mr-1" />
                  {{ $t("files.select-file") }}
                </button>
                <span
                  v-if="fileStore.laboratoryFile"
                  class="text-sm text-gray-700 truncate max-w-xs flex items-center"
                >
                  <DocumentIcon class="w-4 h-4 mr-1" />
                  {{ fileStore.laboratoryFile.name }}
                </span>
                <button
                  v-if="fileStore.laboratoryFile"
                  type="button"
                  class="ml-auto p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                  @click="fileStore.clearLaboratoryFile()"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="mt-3">
                <text-input
                  name="laboratoryDescription"
                  type="text"
                  inputPlaceholder="files.description-placeholder"
                  inputColor="patient-page-color"
                />
              </div>
            </div>

            <!-- Sección de Examen -->
            <div class="p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-green-900 flex items-center">
                  <DocumentTextIcon class="w-5 h-5 mr-2" />
                  {{ $t("files.upload-exam") }} ({{ $t("general.optional") }})
                </label>
                <span
                  v-if="fileStore.examFile"
                  class="text-xs text-green-600 font-medium flex items-center"
                >
                  <CheckIcon class="w-4 h-4 mr-1" />
                  {{ $t("files.file-selected") }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <input
                  ref="examInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  class="hidden"
                  @change="handleExamFileChange"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                  @click="$refs.examInput.click()"
                >
                  <ArrowUpTrayIcon class="w-4 h-4 mr-1" />
                  {{ $t("files.select-file") }}
                </button>
                <span
                  v-if="fileStore.examFile"
                  class="text-sm text-gray-700 truncate max-w-xs flex items-center"
                >
                  <DocumentIcon class="w-4 h-4 mr-1" />
                  {{ fileStore.examFile.name }}
                </span>
                <button
                  v-if="fileStore.examFile"
                  type="button"
                  class="ml-auto p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                  @click="fileStore.clearExamFile()"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="mt-3">
                <text-input
                  name="examDescription"
                  type="text"
                  inputPlaceholder="files.description-placeholder"
                  inputColor="patient-page-color"
                />
              </div>
            </div>

            <div class="mt-3 text-xs text-gray-500 flex items-start">
              <InformationCircleIcon class="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{{ $t("files.file-format-help") }}</span>
            </div>
          </div>
        </form>
      </div>
    </template>

    <template #buttons>
      <primary-button
        v-if="isLoading || fileStore.isLoadingUpload"
        :isDisabled="true"
      >
        <span class="flex items-center">
          <ArrowPathIcon class="animate-spin -ml-1 mr-2 h-4 w-4" />
          {{ $t(fileStore.isLoadingUpload ? "files.uploading" : "medical-records.saving") }}
        </span>
      </primary-button>
      <primary-button
        v-else
        :isDisabled="!isFormValid"
        @click.prevent="handleSubmit"
        @keydown.enter.prevent="handleSubmit"
      >
        <p class="uppercase">
          {{ $t(isEditing ? "general.update" : "general.save") }}
        </p>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import { useMedicalRecordStore } from "@stores/medicalRecordStore.js";
import { useFileStore } from "@stores/FileStore.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { storeToRefs } from "pinia";
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon,
  DocumentIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/vue/24/outline";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import TextInput from "@components/forms/TextInput.vue";
import TextareaInput from "@components/forms/TextareaInput.vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  patientId: { type: [String, Number], required: true },
  record: { type: Object, default: () => null },
});

const emit = defineEmits(["close", "save"]);

const { t } = useI18n();
const medicalRecordStore = useMedicalRecordStore();
const fileStore = useFileStore();
const notificationStore = useNotificationStore();

const { isEditing, currentMedicalRecordId } = storeToRefs(medicalRecordStore);
const { closeMedicalRecordModals } = medicalRecordStore;

const { 
  createMedicalRecord, 
  updateMedicalRecordById, 
  fetchPatientMedicalRecords 
} = medicalRecordStore;

const { uploadFile } = fileStore;

const isLoading = ref(false);
const laboratoryInput = ref(null);
const examInput = ref(null);
const includeRecipe = ref(false);

const originalValues = ref({
  weight: "",
  height: "",
  familyHistory: "",
  notes: "",
});

const validationSchema = yup.object({
  weight: yup
    .number()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === "" ? null : value
    )
    .positive(t("medical-records.weight-must-be-positive")),
  height: yup
    .number()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === "" ? null : value
    )
    .positive(t("medical-records.height-must-be-positive")),
  familyHistory: yup.string().nullable(),
  notes: yup.string().required(t("medical-records.notes-required")),
  prescription: yup.string().nullable(),
  laboratoryDescription: yup.string().nullable(),
  examDescription: yup.string().nullable(),
});

const { values, errors, resetForm, validate } = useForm({
  validationSchema,
  initialValues: {
    weight: "",
    height: "",
    familyHistory: "",
    notes: "",
    prescription: "",
    laboratoryDescription: "",
    examDescription: "",
  },
});

const isFormValid = computed(() => {
  // Verificar que no haya errores de validación
  const hasNoErrors = Object.keys(errors.value).length === 0;
  const notesValue = values.notes?.trim() || "";
  const hasRequiredNotes = notesValue.length > 0;
  let recipeValid = true;
  if (includeRecipe.value) {
    const prescriptionValue = values.prescription?.trim() || "";
    recipeValid = prescriptionValue.length > 0;
  }
  return hasNoErrors && hasRequiredNotes && recipeValid;;
});

function handleClose() {
  fileStore.clearAllFiles();
  resetForm();
  includeRecipe.value = false;
  closeMedicalRecordModals();
  emit("close");
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadRecordData();
    }
  },
  { immediate: true }
);

function loadRecordData() {
  if (isEditing.value && props.record) {
    const record = props.record.medicalRecord || props.record;
    
    originalValues.value = {
      weight: record.weight ? String(record.weight) : "",
      height: record.height ? String(record.height) : "",
      familyHistory: record.familyHistory || "",
      notes: record.notes || "",
    };
    
    resetForm({
      values: {
        weight: "",
        height: "",
        familyHistory: record.familyHistory || "",
        notes: record.notes || "",
        prescription: "",
        laboratoryDescription: "",
        examDescription: "",
      },
    });
  } else {
    originalValues.value = {
      weight: "",
      height: "",
      familyHistory: "",
      notes: "",
    };
    
    resetForm({
      values: {
        weight: "",
        height: "",
        familyHistory: "",
        notes: "",
        prescription: "",
        laboratoryDescription: "",
        examDescription: "",
      },
    });
  }
  
  fileStore.clearAllFiles();
  includeRecipe.value = false;
}

function handleLaboratoryFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    fileStore.setLaboratoryFile(file);
  }
}

function handleExamFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    fileStore.setExamFile(file);
  }
}

async function handleSubmit() {
  const { valid } = await validate();
  
  if (!valid) {
    notificationStore.addNotification(
      "warning",
      "general.warning",
      t("medical-records.notes-required")
    );
    return;
  }

  try {
    isLoading.value = true;
    let weightToSend = null;
    let heightToSend = null;

    if (values.weight !== "" && values.weight !== null && values.weight !== undefined) {
      weightToSend = parseFloat(values.weight);
    } else if (isEditing.value && originalValues.value.weight) {
      weightToSend = parseFloat(originalValues.value.weight);
    }

    if (values.height !== "" && values.height !== null && values.height !== undefined) {
      heightToSend = parseFloat(values.height);
    } else if (isEditing.value && originalValues.value.height) {
      heightToSend = parseFloat(originalValues.value.height);
    }

    const medicalRecordData = {
      Weight: weightToSend,
      Height: heightToSend,
      FamilyHistory: values.familyHistory || null,
      Notes: values.notes || null,
    };

    let result = null;
    let recordId = null;

    if (isEditing.value && currentMedicalRecordId.value) {
      result = await updateMedicalRecordById(
        currentMedicalRecordId.value, 
        medicalRecordData
      );
      recordId = currentMedicalRecordId.value;
      
    } else {
      result = await createMedicalRecord(props.patientId, medicalRecordData);
      recordId = result?.id;
    }

    if (includeRecipe.value && values.prescription?.trim()) {
      const recipeData = {
        prescription: values.prescription.trim(),
        medicalRecordId: recordId
      };
      
      try {
        await medicalRecordStore.createRecipe(recipeData);
      } finally {
        // No hacer nada especial aquí
      }
    }

    if (recordId) {
      const uploadPromises = [];

      if (fileStore.laboratoryFile) {
        uploadPromises.push(
          uploadFile(
            fileStore.laboratoryFile,
            "Laboratory",
            props.patientId,
            values.laboratoryDescription || t("files.upload-laboratory"),
            recordId,
          ),
        );
      }

      if (fileStore.examFile) {
        uploadPromises.push(
          uploadFile(
            fileStore.examFile,
            "Exam",
            props.patientId,
            values.examDescription || t("files.upload-exam"),
            recordId,
          ),
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
    }
    await fetchPatientMedicalRecords(props.patientId);
    
    fileStore.clearAllFiles();
    resetForm();
    includeRecipe.value = false;
    
    closeMedicalRecordModals();
    
    emit("save", result);
  } finally {
    isLoading.value = false;
  }
}
</script>
