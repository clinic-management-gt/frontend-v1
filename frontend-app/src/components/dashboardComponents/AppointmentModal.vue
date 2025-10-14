<template>
  <general-dialog-modal
    :isOpen="isOpen"
    dialogSize="max-w-2xl"
    @close-modal="handleClose"
  >
    <template #title>
      <p class="text-xl font-semibold">
        {{ $t("dashboard.new-appointment") }}
      </p>
    </template>

    <template #body>
      <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Selección de Paciente -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            {{ $t("dashboard.patient") }}
          </label>
          
          <!-- Toggle entre paciente existente y nuevo -->
          <div class="mb-4">
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="patientType"
                  type="radio"
                  value="existing"
                  class="mr-2"
                />
                {{ $t("dashboard.select-existing-patient") }}
              </label>
              <label class="flex items-center">
                <input
                  v-model="patientType"
                  type="radio"
                  value="new"
                  class="mr-2"
                />
                {{ $t("dashboard.create-new-patient") }}
              </label>
            </div>
          </div>

          <!-- Selector de paciente existente -->
          <div v-if="patientType === 'existing'">
            <combo-box-autocomplete-input-search-patient
              :data="allPatients"
              :currentSelected="selectedPatientId"
              :placeholder="$t('general.search-patient')"
              @update:current-selected="onPatientSelected"
            />
          </div>

          <!-- Input para nuevo paciente -->
          <div v-if="patientType === 'new'">
            <div class="space-y-4">
              <input
                v-model="newPatientName"
                type="text"
                required
                :placeholder="$t('dashboard.patient-name')"
                class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              />
              
              <!-- Selección de género -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t("dashboard.patient-gender") }}
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="newPatientGender"
                      type="radio"
                      value="masculino"
                      class="mr-2"
                    />
                    {{ $t("general.male") }}
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="newPatientGender"
                      type="radio"
                      value="femenino"
                      class="mr-2"
                    />
                    {{ $t("general.female") }}
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="newPatientGender"
                      type="radio"
                      value="no_especificado"
                      class="mr-2"
                    />
                    {{ $t("general.not-specified") }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fecha de la cita -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t("dashboard.appointment-date") }}
          </label>
          <input
            v-model="appointmentDate"
            type="date"
            required
            :min="todayDate"
            class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          />
        </div>

        <!-- Hora de la cita -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t("dashboard.appointment-time") }}
          </label>
          <input
            v-model="appointmentTime"
            type="time"
            required
            class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          />
        </div>

        <!-- Motivo de la cita -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t("dashboard.appointment-reason") }}
          </label>
          <textarea
            v-model="appointmentReason"
            rows="3"
            :placeholder="$t('dashboard.appointment-reason-placeholder')"
            class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm resize-none"
          ></textarea>
        </div>
      </form>
    </template>

    <template #buttons>
      <div class="flex justify-end">
        <button
          type="button"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          @click="handleSubmit"
        >
          <span v-if="isLoading">{{ $t("general.loading") }}...</span>
          <span v-else>{{ $t("general.save") }}</span>
        </button>
      </div>
    </template>
  </general-dialog-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { usePatientsStore } from "@stores/patientsStore";
import { useNotificationStore } from "@stores/notificationStore.js";
import { storeToRefs } from "pinia";
import { globalI18n } from "@/langs/index.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import ComboBoxAutocompleteInputSearchPatient from "@components/forms/ComboBoxAutocompleteInputSearchPatient.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  preselectedDate: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "appointment-created"]);

// Stores
const patientsStore = usePatientsStore();
const notificationStore = useNotificationStore();
const { allPatients } = storeToRefs(patientsStore);

// Estado del formulario
const patientType = ref("existing");
const selectedPatientId = ref(null);
const newPatientName = ref("");
const newPatientGender = ref("no_especificado");
const appointmentDate = ref("");
const appointmentTime = ref("");
const appointmentReason = ref("");
const isLoading = ref(false);

// Watcher para aplicar fecha preseleccionada
watch(
  () => [props.isOpen, props.preselectedDate],
  ([isOpen, preselectedDate]) => {
    if (isOpen) {
      resetForm();
      if (preselectedDate) {
        appointmentDate.value = preselectedDate;
      }
    }
  },
  { immediate: true }
);

// Fecha mínima (hoy)
const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

/**
 * Maneja la selección de paciente existente
 */
function onPatientSelected(patientId) {
  selectedPatientId.value = patientId;
}

/**
 * Cierra el modal y resetea el formulario
 */
function handleClose() {
  emit("close");
  // Reseteamos después de cerrar para no perder valores durante la animación de cierre
  setTimeout(() => resetForm(), 300);
}

/**
 * Resetea todos los campos del formulario
 */
function resetForm() {
  patientType.value = "existing";
  selectedPatientId.value = null;
  newPatientName.value = "";
  newPatientGender.value = "no_especificado";
  
  // Mantenemos la fecha preseleccionada si existe, si no la reseteamos
  if (!props.preselectedDate) {
    appointmentDate.value = "";
  }
  
  appointmentTime.value = "";
  appointmentReason.value = "";
  isLoading.value = false;
}

/**
 * Maneja el envío del formulario
 */
async function handleSubmit() {
  if (isLoading.value) return;

  // Validaciones básicas
  if (patientType.value === "existing" && !selectedPatientId.value) {
    notificationStore.addNotification(
      "warning",
      "general.warning",
      globalI18n.t("dashboard.please-select-patient")
    );
    return;
  }

  if (patientType.value === "new" && !newPatientName.value.trim()) {
    notificationStore.addNotification(
      "warning", 
      "general.warning",
      globalI18n.t("dashboard.please-enter-patient-name")
    );
    return;
  }

  if (!appointmentDate.value || !appointmentTime.value) {
    notificationStore.addNotification(
      "warning",
      "general.warning", 
      globalI18n.t("dashboard.please-complete-date-time")
    );
    return;
  }

  isLoading.value = true;

  try {
    let patientId = selectedPatientId.value;

    // Si es paciente nuevo, crearlo primero
    if (patientType.value === "new") {
      const nameParts = newPatientName.value.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const newPatient = await patientsStore.createBasicPatient({
        name: firstName,
        lastName: lastName,
        gender: newPatientGender.value
      });
      
      patientId = newPatient.id;
    }

    // Crear la cita
    const appointmentDateTime = `${appointmentDate.value}T${appointmentTime.value}:00`;
    
    await patientsStore.createAppointment({
      patientId: patientId,
      appointmentDate: appointmentDateTime,
      reason: appointmentReason.value || null,
      status: "pendiente"
    });

    // Notificación de éxito
    notificationStore.addNotification(
      "success",
      "notifications.success",
      globalI18n.t("dashboard.appointment-scheduled-successfully")
    );

    emit("appointment-created");
  } catch {
    notificationStore.addNotification(
      "error",
      "general.error",
      globalI18n.t("dashboard.error-scheduling-appointment")
    );
  } finally {
    isLoading.value = false;
  }
}

// Cargar pacientes al montar el componente
onMounted(() => {
  patientsStore.fetchAllPatients();
});
</script>
