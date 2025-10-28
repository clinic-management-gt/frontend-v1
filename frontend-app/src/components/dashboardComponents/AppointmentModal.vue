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
              <text-input
                name="newPatientFirstName"
                type="text"
                title="general.first-name"
                inputPlaceholder="general.first-name"
                labelCss="text-sm font-medium text-gray-700"
                :required="true"
              />

              <!-- Apellido -->
              <text-input
                name="newPatientLastName"
                type="text"
                title="general.last-name"
                inputPlaceholder="general.last-name"
                labelCss="text-sm font-medium text-gray-700"
                :required="true"
              />

              <!-- Fecha de nacimiento -->
              <text-input
                name="newPatientBirthdate"
                type="date"
                title="general.birthdate"
                inputPlaceholder="general.birthdate"
                labelCss="text-sm font-medium text-gray-700"
                :required="true"
              />

              <!-- Selección de género -->
              <radio-group
                name="newPatientGender"
                title="dashboard.patient-gender"
                :data="genderOptions"
                labelCss="text-sm font-medium text-gray-700"
                :required="true"
              />

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
                    <span class="text-sm font-medium text-gray-700">{{ $t('patients.contact') }} {{ index + 1 }}</span>
                    <button
                      v-if="newPatientContacts.length > 1"
                      type="button"
                      @click="removeContact(index)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      {{ $t('dashboard.remove-contact') }}
                    </button>
                  </div>

                  <div class="space-y-2">
                    <select
                      v-model="contact.type"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">{{ $t('dashboard.select-contact-type') }}</option>
                      <option value="Padre">{{ $t('dashboard.contact-type-father') }}</option>
                      <option value="Madre">{{ $t('dashboard.contact-type-mother') }}</option>
                      <option value="Tutor">{{ $t('dashboard.contact-type-tutor') }}</option>
                      <option value="Otro">{{ $t('dashboard.contact-type-other') }}</option>
                    </select>

                    <input
                      v-model="contact.phoneNumber"
                      type="tel"
                      :placeholder="$t('patients.phone-contact-placeholder')"
                      class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  @click="addContact"
                  class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + {{ $t('dashboard.add-contact') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Fecha de la cita -->
        <text-input
          name="appointmentDate"
          type="date"
          title="dashboard.appointment-date"
          inputPlaceholder="dashboard.appointment-date"
          labelCss="text-sm font-medium text-gray-700"
          :required="true"
        />

        <!-- Hora de la cita -->
        <text-input
          name="appointmentTime"
          type="time"
          title="dashboard.appointment-time"
          inputPlaceholder="dashboard.appointment-time"
          labelCss="text-sm font-medium text-gray-700"
          :required="true"
        />

        <!-- Motivo de la cita -->
        <textarea-input
          name="appointmentReason"
          title="dashboard.appointment-reason"
          inputPlaceholder="dashboard.appointment-reason-placeholder"
          labelCss="text-sm font-medium text-gray-700"
          :rows="3"
        />
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
import { useForm } from "vee-validate";
import * as yup from "yup";
import { usePatientsStore } from "@stores/patientsStore";
import { useNotificationStore } from "@stores/notificationStore.js";
import { storeToRefs } from "pinia";
import { globalI18n } from "@/langs/index.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import ComboBoxAutocompleteInputSearchPatient from "@components/forms/ComboBoxAutocompleteInputSearchPatient.vue";
import TextInput from "@components/forms/TextInput.vue";
import TextareaInput from "@components/forms/TextareaInput.vue";
import RadioGroup from "@components/forms/RadioGroup.vue";

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

// Validation Schema
const validationSchema = yup.object({
  newPatientFirstName: yup.string().when("$patientType", {
    is: "new",
    then: (schema) => schema.required(globalI18n.t("general.first-name") + " es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPatientLastName: yup.string().when("$patientType", {
    is: "new",
    then: (schema) => schema.required(globalI18n.t("general.last-name") + " es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPatientBirthdate: yup.string().when("$patientType", {
    is: "new",
    then: (schema) => schema.required(globalI18n.t("general.birthdate") + " es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPatientGender: yup.string().when("$patientType", {
    is: "new",
    then: (schema) => schema.required(globalI18n.t("general.gender") + " es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  appointmentDate: yup.string().required(globalI18n.t("dashboard.appointment-date") + " es requerido"),
  appointmentTime: yup.string().required(globalI18n.t("dashboard.appointment-time") + " es requerido"),
  appointmentReason: yup.string().nullable(),
});

// Initialize vee-validate form
const { values, resetForm: resetVeeForm, validate } = useForm({
  validationSchema,
  initialValues: {
    newPatientFirstName: "",
    newPatientLastName: "",
    newPatientBirthdate: "",
    newPatientGender: "no_especificado",
    appointmentDate: "",
    appointmentTime: "",
    appointmentReason: "",
  },
});

// Estado del formulario (refs que no están en vee-validate)
const patientType = ref("existing");
const selectedPatientId = ref(null);
const newPatientContacts = ref([{ type: "", phoneNumber: "" }]);
const isLoading = ref(false);

// Opciones de género para RadioGroup
const genderOptions = [
  { id: "masculino", name: "general.male" },
  { id: "femenino", name: "general.female" },
  { id: "no_especificado", name: "general.not-specified" },
];

// Watcher para aplicar fecha preseleccionada
watch(
  () => [props.isOpen, props.preselectedDate],
  ([isOpen, preselectedDate]) => {
    if (isOpen) {
      resetForm();
      if (preselectedDate) {
        resetVeeForm({
          values: {
            ...values,
            appointmentDate: preselectedDate,
          },
        });
      }
    }
  },
  { immediate: true }
);

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
  // Resetear vee-validate form
  resetVeeForm({
    values: {
      newPatientFirstName: "",
      newPatientLastName: "",
      newPatientBirthdate: "",
      newPatientGender: "no_especificado",
      appointmentDate: props.preselectedDate || "",
      appointmentTime: "",
      appointmentReason: "",
    },
  });

  // Resetear campos que no están en vee-validate
  patientType.value = "existing";
  selectedPatientId.value = null;
  newPatientContacts.value = [{ type: "", phoneNumber: "" }];
  isLoading.value = false;
}

/**
 * Maneja el envío del formulario
 */
async function handleSubmit() {
  if (isLoading.value) return;

  // Validar el formulario con vee-validate
  const { valid } = await validate({ context: { patientType: patientType.value } });

  // Validaciones básicas
  if (patientType.value === "existing" && !selectedPatientId.value) {
    notificationStore.addNotification(
      "warning",
      "general.warning",
      globalI18n.t("dashboard.please-select-patient")
    );
    return;
  }

  if (patientType.value === "new" && !valid) {
    notificationStore.addNotification(
      "warning",
      "general.warning",
      "Por favor complete todos los campos requeridos"
    );
    return;
  }

  if (!valid) {
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
        name: values.newPatientFirstName.trim(),
        lastName: values.newPatientLastName.trim(),
        birthdate: values.newPatientBirthdate,
        gender: values.newPatientGender,
        contacts: validContacts
      });

      patientId = newPatient.id;
    }

    // Crear la cita
    const appointmentDateTime = `${values.appointmentDate}T${values.appointmentTime}:00`;

    await patientsStore.createAppointment({
      patientId: patientId,
      isPendingPatient: patientType.value === "new",
      appointmentDate: appointmentDateTime,
      reason: values.appointmentReason || null,
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
