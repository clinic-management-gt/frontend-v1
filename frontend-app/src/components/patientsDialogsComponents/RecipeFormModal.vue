<template>
  <general-dialog-modal
    :isOpen="isOpen"
    dialogSize="max-w-2xl"
    @close-modal="handleClose"
  >
    <template #title>
      <p class="text-xl">
        {{ $t(isEditing ? "recipes.edit-recipe" : "recipes.create-recipe") }}
      </p>
    </template>
    <template #body>
      <div class="space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- Formulario principal -->
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <!-- Alerta si no hay treatmentId -->
          <div
            v-if="!props.isEditing && !props.treatmentId"
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <div class="text-yellow-400 text-lg mr-2">
                ⚠️
              </div>
              <div>
                <h4 class="text-yellow-800 font-semibold">
                  {{ $t("recipes.warning") }}
                </h4>
                <p class="text-yellow-700 text-sm">
                  {{ $t("recipes.warning-no-treatment") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Información de la receta -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">
              Receta médica
            </h3>

            <!-- Prescripción -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{
                $t("recipes.prescription")
              }}</label>

              <!-- Mostrar fecha de creación actual como referencia -->
              <div
                v-if="props.isEditing && originalValues.createdAt"
                class="mb-3 text-xs text-gray-500 bg-gray-50 p-3 rounded border"
              >
                <div class="flex items-center justify-between">
                  <span>📅 <strong>{{ $t("recipes.creation-date") }}:</strong>
                    {{ formatDate(originalValues.createdAt) }}</span>
                  <span
                    v-if="originalValues.updatedAt"
                    class="ml-4"
                  >✏️ <strong>{{ $t("recipes.last-edit") }}:</strong>
                    {{ formatDate(originalValues.updatedAt) }}</span>
                </div>
                <div
                  v-if="originalValues.treatmentId"
                  class="mt-1"
                >
                  🔗 <strong>{{ $t("recipes.treatment-id") }}:</strong>
                  {{ originalValues.treatmentId }}
                </div>
              </div>

              <textarea
                v-model="formData.prescription"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="8"
                :placeholder="$t('recipes.prescription-placeholder')"
                tabindex="0"
                required
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </template>

    <!-- Botones de acción -->
    <template #buttons>
      <primary-button
        v-if="medicalRecordStore.loading"
        :disabled="medicalRecordStore.loading"
      >
        <span class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {{ $t("recipes.saving") }}
        </span>
      </primary-button>
      <primary-button
        v-else
        :disabled="medicalRecordStore.loading || !formData.prescription.trim()"
        @click="handleSubmit"
      >
        <p class="uppercase">
          {{ $t(isEditing ? "general.update" : "general.save") }}
        </p>
      </primary-button>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useMedicalRecordStore } from "@stores/medicalRecordStore.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { formatDate } from "@utils/isoFormatDate.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import PrimaryButton from "@components/forms/PrimaryButton.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    default: () => null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  treatmentId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

const { t } = useI18n();
const medicalRecordStore = useMedicalRecordStore();
const notificationStore = useNotificationStore();

const { updateRecipe, createRecipe } = medicalRecordStore;
const { closeMedicalRecordModals } = medicalRecordStore;

// Estados
const formData = ref({
  prescription: "",
});

// Valores originales para mostrar como referencia
const originalValues = ref({
  createdAt: "",
  updatedAt: "",
  treatmentId: "",
});

// Función para cerrar el modal
function handleClose() {
  closeMedicalRecordModals();
  emit("close");
}

// Cargar datos de la receta cuando se abre en modo edición
function loadRecipeData() {
  if (props.isEditing && props.recipe) {
    // Guardar valores originales para mostrar como referencia
    originalValues.value = {
      createdAt: props.recipe.createdAt || "",
      updatedAt: props.recipe.updatedAt || "",
      treatmentId: props.recipe.treatmentId || "",
    };

    formData.value = {
      prescription: props.recipe.prescription || "",
    };
  } else {
    // Resetear valores para nueva receta
    originalValues.value = {
      createdAt: "",
      updatedAt: "",
      treatmentId: "",
    };

    formData.value = {
      prescription: "",
    };
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  if (!formData.value.prescription.trim()) {
    return;
  }

  try {
    const dataToSend = {
      prescription: formData.value.prescription.trim(),
    };

    let result;
    if (props.isEditing && props.recipe?.id) {
      // Actualizar receta existente
      result = await updateRecipe(props.recipe.id, dataToSend);

      // Actualizar la fecha de última edición con la fecha actual
      const now = new Date().toISOString();

      // Forzar reactividad creando un nuevo objeto
      originalValues.value = {
        ...originalValues.value,
        updatedAt: now,
      };

      // Asegurar que Vue detecte el cambio
      await nextTick();

      notificationStore.addNotification(
        "success",
        "notifications.success",
        t("recipes.recipe-updated"),
      );
    } else {
      // Crear nueva receta
      if (props.treatmentId) {
        dataToSend.treatmentId = props.treatmentId;
      } else {
        notificationStore.addNotification(
          "warning",
          "general.warning",
          t("recipes.error-no-treatment"),
        );
        return;
      }
      result = await createRecipe(dataToSend);
      notificationStore.addNotification(
        "success",
        "notifications.success",
        t("recipes.recipe-created"),
      );
    }

    emit("save", result);
    handleClose();
  } catch (error) {
    notificationStore.addNotification(
      "error",
      "notifications.error",
      t("recipes.error-saving") +
        ": " +
        (error.message || t("recipes.unknown-error")),
    );
  }
}

// Observar cambios en props para cargar datos
watch(
  [() => props.isOpen, () => props.recipe],
  () => {
    if (props.isOpen) {
      nextTick(() => {
        loadRecipeData();
        // Intentar enfocar el textarea después de que se cargue
        setTimeout(() => {
          // Quitar el foco del elemento actual
          if (document.activeElement) {
            document.activeElement.blur();
          }

          const textarea = document.querySelector(
            'textarea[placeholder*="prescripción"]',
          );
          if (textarea) {
            // Forzar el enfoque múltiples veces para asegurar que funcione
            textarea.focus();
            textarea.click();
            textarea.focus();
          }
        }, 500);
      });
    }
  },
  { immediate: true },
);
</script>
