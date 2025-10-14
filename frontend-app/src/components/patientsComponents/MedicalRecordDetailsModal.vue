<template>
  <general-dialog-modal
    ref="detailsDialog"
    :isOpen="isOpen"
    dialogSize="max-w-4xl"
    @close-modal="$emit('close')"
  >
    <!-- Header -->
    <template #title>
      <div class="flex justify-between items-center px-6 py-2 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl -mx-6 -mt-6 mb-4">
        <div>
          <h2 class="text-2xl font-bold">
            {{ $t("patients.consult-detail") }}
          </h2>
          <p class="text-blue-100 mt-1">
            {{ formatRecordDate(record?.createdAt) }}
          </p>
        </div>
        <button
          class="text-white hover:text-gray-200 text-2xl p-2 rounded-full hover:bg-blue-700 transition-colors"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>
    </template>

    <!-- Body -->
    <template #body>
      <div class="overflow-y-auto max-h-[calc(90vh-240px)]">
        <div class="space-y-6">
          <!-- Información general -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-800">
              {{ $t("general.general-info") }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">{{ $t("general.date") }}:</span>
                <p class="font-medium">
                  {{ formatRecordDate(record?.createdAt) }}
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-600">{{ $t("general.status") }}:</span>
                <p class="font-medium">
                  {{ record?.status || "Completado" }}
                </p>
              </div>
              <div v-if="record?.appointmentType">
                <span class="text-sm text-gray-600">{{ $t("general.appointment-type") }}:</span>
                <p class="font-medium">
                  {{ record.appointmentType }}
                </p>
              </div>
              <div v-if="record?.diagnosis">
                <span class="text-sm text-gray-600">{{ $t("general.diagnosis") }}:</span>
                <p class="font-medium">
                  {{ record.diagnosis }}
                </p>
              </div>
            </div>
          </div>

          <!-- Nota de evolución -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-blue-800">
                {{ $t("patients.evolution-note") }}
              </h3>
              <button
                class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                @click="editEvolutionNote"
              >
                <action-button-solid-icon
                  icon="PencilIcon"
                  size="h-4 w-4"
                  color="text-blue-600"
                />
                Editar
              </button>
            </div>
            <div
              v-if="record?.medicalRecord?.notes || record?.evolutionNote"
              class="prose max-w-none"
            >
              <p class="text-gray-700 whitespace-pre-line">
                {{ record?.medicalRecord?.notes || record?.evolutionNote }}
              </p>
            </div>
            <div
              v-else
              class="text-gray-400 italic py-4"
            >
              {{ $t("patients.no-evolution-note") }}
            </div>
          </div>

          <!-- Receta médica -->
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-green-800">
                {{ $t("patients.medical-recipe") }}
              </h3>
              <button
                v-if="record?.recipes && record.recipes.length > 0"
                class="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                @click="editFirstRecipe"
              >
                <action-button-solid-icon
                  icon="PencilIcon"
                  size="h-4 w-4"
                  color="text-green-600"
                />
                Editar
              </button>
            </div>
            <div v-if="record?.recipes && record.recipes.length > 0">
              <div
                v-for="(recipe, index) in record.recipes"
                :key="index"
                class="mb-3 p-3 bg-white rounded border relative"
              >
                <button
                  class="absolute top-2 right-2 text-green-600 hover:text-green-800 p-1 rounded"
                  title="Editar receta"
                  @click="editRecipe(recipe)"
                >
                  <action-button-solid-icon
                    icon="PencilIcon"
                    size="h-4 w-4"
                    color="text-green-600"
                  />
                </button>
                <div class="text-sm text-gray-600 mb-2">
                  <strong>Fecha:</strong>
                  {{ formatRecordDate(recipe.createdAt) }}
                </div>
                <div class="whitespace-pre-line text-gray-700 pr-8">
                  {{ recipe.prescription }}
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-gray-400 italic py-4"
            >
              {{ $t("patients.no-prescription") }}
            </div>
          </div>

          <!-- Exámenes -->
          <div
            v-if="record?.exams && record.exams.length > 0"
            class="bg-purple-50 rounded-lg p-4"
          >
            <h3 class="text-lg font-semibold mb-3 text-purple-800">
              {{ $t("patients.exams") }}
            </h3>
            <div class="space-y-2">
              <div
                v-for="(exam, index) in record.exams"
                :key="index"
                class="p-3 bg-white rounded border"
              >
                <div class="font-medium text-gray-800">
                  {{ exam.name || exam.type }}
                </div>
                <div
                  v-if="exam.result"
                  class="text-sm text-gray-600 mt-1"
                >
                  <strong>Resultado:</strong> {{ exam.result }}
                </div>
                <div
                  v-if="exam.observations"
                  class="text-sm text-gray-500 mt-1"
                >
                  {{ exam.observations }}
                </div>
              </div>
            </div>
          </div>

          <!-- Observaciones generales -->
          <div
            v-if="record?.observations"
            class="bg-yellow-50 rounded-lg p-4"
          >
            <h3 class="text-lg font-semibold mb-3 text-yellow-800">
              {{ $t("general.observations") }}
            </h3>
            <p class="text-gray-700 whitespace-pre-line">
              {{ record.observations }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #buttons>
      <primary-button
        class="mr-2"
        bgColor="blue"
        @click="editRecord"
      >
        <action-button-solid-icon
          icon="PencilIcon"
          size="h-4 w-4"
          color="text-white"
        />
        <span class="ml-2 uppercase">{{ $t("general.edit") }}</span>
      </primary-button>
      <primary-button
        class="mr-2"
        bgColor="green"
        @click="downloadRecord"
      >
        <action-button-solid-icon
          icon="ArrowDownTrayIcon"
          size="h-4 w-4"
          color="text-white"
        />
        <span class="ml-2 uppercase">{{ $t("general.download") }}</span>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import ActionButtonSolidIcon from "@components/forms/ActionButtonSolidIcon.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";
import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";

const props = defineProps({
  record: {
    type: Object,
    default: () => ({}),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "edit", "download"]);

const patientsLogicStore = usePatientsLogicStore();
const { openEditModal, openRecipeFormModal } = patientsLogicStore;

function formatRecordDate(dateString) {
  if (!dateString) return "Fecha no disponible";

  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Fecha no disponible";
  }
}

function editRecord() {
  emit("edit", props.record);
}

function editEvolutionNote() {
  openEditModal(props.record);
}

function editRecipe(recipe) {
  openRecipeFormModal(recipe);
}

function editFirstRecipe() {
  if (props.record?.recipes && props.record.recipes.length > 0) {
    editRecipe(props.record.recipes[0]);
  }
}

function downloadRecord() {
  emit("download", props.record);
}
</script>
