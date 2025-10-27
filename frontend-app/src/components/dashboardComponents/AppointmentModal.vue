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
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('general.first-name') }}
                </label>
                <input
                  v-model="newPatientFirstName"
                  type="text"
                  required
                  :placeholder="$t('general.first-name')"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                />
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('general.last-name') }}
                </label>
                <input
                  v-model="newPatientLastName"
                  type="text"
                  required
                  :placeholder="$t('general.last-name')"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                />
              </div>

              <!-- Fecha de nacimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('general.birthdate') }}
                </label>
                <input
                  v-model="newPatientBirthdate"
                  type="date"
                  required
                  :max="todayDate"
                  class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                />
              </div>

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

              <!-- Contactos -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('patients.contacts') }}
                </label>
                <div
                  v-for="(contact, index) in newPatientContacts"
                  :key="index"
                  class="mb-3 p-3 border rounded-md bg-gray-50"
                >
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Contacto {{ index + 1 }}</span>
                    <button
                      v-if="newPatientContacts.length > 1"
                      type="button"
                      @click="removeContact(index)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div class="space-y-2">
                    <select
                      v-model="contact.type"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Padre">Padre</option>
                      <option value="Madre">Madre</option>
                      <option value="Tutor">Tutor</option>
                      <option value="Otro">Otro</option>
                    </select>

                    <input
                      v-model="contact.phoneNumber"
                      type="tel"
                      placeholder="Número de teléfono"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  @click="addContact"
                  class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Agregar contacto
                </button>
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
const newPatientFirstName = ref("");
const newPatientLastName = ref("");
const newPatientBirthdate = ref("");
const newPatientGender = ref("no_especificado");
const newPatientContacts = ref([{ type: "", phoneNumber: "" }]);
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
 * Agrega un nuevo contacto
 */
function addContact() {
  newPatientContacts.value.push({ type: "", phoneNumber: "" });
}

/**
 * Elimina un contacto
 */
function removeContact(index) {
  newPatientContacts.value.splice(index, 1);
}

/**
 * Resetea todos los campos del formulario
 */
function resetForm() {
  patientType.value = "existing";
  selectedPatientId.value = null;
  newPatientFirstName.value = "";
  newPatientLastName.value = "";
  newPatientBirthdate.value = "";
  newPatientGender.value = "no_especificado";
  newPatientContacts.value = [{ type: "", phoneNumber: "" }];

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

  if (patientType.value === "new") {
    if (!newPatientFirstName.value.trim() || !newPatientLastName.value.trim()) {
      notificationStore.addNotification(
        "warning",
        "general.warning",
        "Por favor ingrese nombre y apellido completos"
      );
      return;
    }

    if (!newPatientBirthdate.value) {
      notificationStore.addNotification(
        "warning",
        "general.warning",
        "Por favor ingrese la fecha de nacimiento"
      );
      return;
    }
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
      // Filtrar contactos que tengan al menos el número de teléfono
      const validContacts = newPatientContacts.value
        .filter(c => c.phoneNumber.trim() !== "")
        .map(c => ({
          type: c.type || "Otro",
          phoneNumber: c.phoneNumber
        }));

      const newPatient = await patientsStore.createPendingPatient({
        name: newPatientFirstName.value.trim(),
        lastName: newPatientLastName.value.trim(),
        birthdate: newPatientBirthdate.value,
        gender: newPatientGender.value,
        contacts: validContacts
      });

      patientId = newPatient.id;
    }

    // Crear la cita
    const appointmentDateTime = `${appointmentDate.value}T${appointmentTime.value}:00`;

    await patientsStore.createAppointment({
      patientId: patientId,
      isPendingPatient: patientType.value === "new",
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

    handleClose();
    emit("appointment-created");
  } catch (error) {
    console.error("Error:", error);
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
