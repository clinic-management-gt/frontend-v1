<template>
  <div class="ml-2 grid grid-cols-2 gap-2">
    <!-- name input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="names"
      type="text"
      title="patients.names"
      inputPlaceholder="patients.names-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />
    <!-- last name input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="lastNames"
      type="text"
      title="patients.lastNames"
      inputPlaceholder="patients.lastNames-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />
    <!-- birthdate input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="birthdate"
      type="date"
      title="patients.birthdate"
      inputPlaceholder="patients.birthdate"
      class="mt-2 sm:col-span-1"
      inputColor="patient-page-color"
    />
    <!-- gender input -->
    <radio-group
      v-model:currentSelected="currentGender"
      title="patients.gender"
      :data="genders"
      class="mt-2 col-span-2 sm:col-span-1"
    />

    <!-- alergies selector -->
    <radio-group
      v-model:currentSelected="hasAlergies"
      title="patients.suffer-from-allergies"
      :data="yesnoOptions"
      class="mt-2 sm:col-span-2"
    />
    <div
      v-if="hasAlergies === 0"
      class="w-full col-span-2"
    >
      <comboboxes-input
        v-model:currentSelected="currentAlergies"
        :data="alergies"
        title="patients.alergies"
        placeholder="patients.alergies-placeholder"
        class="mt-2 sm:col-span-2"
      />
    </div>

    <!-- syndrome selector -->
    <radio-group
      v-model:currentSelected="hasSyndromes"
      title="patients.suffer-from-syndromes"
      :data="yesnoOptions"
      class="mt-2 sm:col-span-2"
    />
    <div
      v-if="hasSyndromes === 0"
      class="w-full col-span-2"
    >
      <comboboxes-input
        v-model:currentSelected="currentSyndromes"
        :data="syndrome"
        title="patients.syndrome"
        placeholder="patients.syndrome-placeholder"
        class="mt-2 sm:col-span-2"
      />
    </div>

    <!-- pediatrician input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="pediatrician"
      type="text"
      title="patients.family-pediatrician"
      inputPlaceholder="patients.pediatrician-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />

    <!-- contact inputs -->
    <div class="sm:col-span-2 space-y-4">
      <div class="flex items-center justify-between">
        <custom-label
          title="patients.add-contact-information"
          :isRequired="true"
        />
        <action-button-outline-icon
          icon="PlusIcon"
          color="text-patient-page-color"
          @click="addContact()"
        />
      </div>
      
      <!-- Lista de contactos -->
      <div
        v-for="contact in contactInformationList"
        :key="contact.id"
        class="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
      >
        <!-- Header del contacto con botón eliminar -->
        <div class="flex items-center justify-between border-b border-gray-300 pb-2">
          <p class="text-sm font-semibold text-gray-700">
            {{ $t('patients.contact') }} #{{ contactInformationList.indexOf(contact) + 1 }}
          </p>
          <action-button-outline-icon
            icon="TrashIcon"
            color="text-red-500"
            @click="deleteContact(contact.id)"
          />
        </div>

        <!-- Nombre y Apellido del contacto -->
        <div class="grid grid-cols-2 gap-3">
          <text-input
            inputClassError="ring-yellow-300 focus:ring-yellow-600"
            :name="`contact_name_${contact.id}`"
            type="text"
            title="patients.contact-name"
            inputPlaceholder="patients.contact-information-placeholder"
            inputColor="patient-page-color"
          />
          <text-input
            inputClassError="ring-yellow-300 focus:ring-yellow-600"
            :name="`contact_lastname_${contact.id}`"
            type="text"
            title="patients.contact-lastname"
            inputPlaceholder="patients.contact-lastname-placeholder"
            inputColor="patient-page-color"
          />
        </div>

        <!-- Tipo de relación -->
        <text-input
          inputClassError="ring-yellow-300 focus:ring-yellow-600"
          :name="`relation_${contact.id}`"
          type="text"
          title="patients.relation"
          inputPlaceholder="patients.relation-placeholder"
          inputColor="patient-page-color"
        />

        <!-- Teléfonos del contacto -->
        <div class="space-y-2 bg-white p-3 rounded border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700">
              {{ $t('patients.phone-contact') }}
            </p>
            <action-button-outline-icon
              icon="PlusIcon"
              color="text-patient-page-color"
              @click="addPhoneToContact(contact.id)"
            />
          </div>
          <div
            v-for="phone in contact.phones"
            :key="phone.id"
            class="flex items-center gap-2"
          >
            <text-input
              inputClassError="ring-yellow-300 focus:ring-yellow-600"
              :name="`contact_${contact.id}_phone_${phone.id}`"
              type="text"
              inputPlaceholder="patients.phone-contact-placeholder"
              inputColor="patient-page-color"
              class="w-full"
            />
            <action-button-outline-icon
              icon="TrashIcon"
              color="text-red-500"
              @click="deletePhoneFromContact(contact.id, phone.id)"
            />
          </div>
          <p
            v-if="contact.phones.length === 0"
            class="text-xs text-gray-400 italic"
          >
            {{ $t('patients.no-phones-added') }}
          </p>
        </div>

        <!-- Emails del contacto -->
        <div class="space-y-2 bg-white p-3 rounded border border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700">
              {{ $t('patients.email-address') }}
            </p>
            <action-button-outline-icon
              icon="PlusIcon"
              color="text-patient-page-color"
              @click="addEmailToContact(contact.id)"
            />
          </div>
          <div
            v-for="email in contact.emails"
            :key="email.id"
            class="flex items-center gap-2"
          >
            <text-input
              inputClassError="ring-yellow-300 focus:ring-yellow-600"
              :name="`contact_${contact.id}_email_${email.id}`"
              type="email"
              inputPlaceholder="patients.email-address-placeholder"
              inputColor="patient-page-color"
              class="w-full"
            />
            <action-button-outline-icon
              icon="TrashIcon"
              color="text-red-500"
              @click="deleteEmailFromContact(contact.id, email.id)"
            />
          </div>
          <p
            v-if="contact.emails.length === 0"
            class="text-xs text-gray-400 italic"
          >
            {{ $t('patients.no-emails-added') }}
          </p>
        </div>
      </div>

      <!-- Mensaje cuando no hay contactos -->
      <p
        v-if="contactInformationList.length === 0"
        class="text-sm text-gray-400 italic text-center py-4"
      >
        {{ $t('patients.no-contacts-added') }}
      </p>
    </div>

    <!-- insurance selector -->
    <comboboxes-input
      v-model:currentSelected="currentInsurance"
      :data="insurances"
      title="patients.insurance"
      placeholder="patients.insurance-placeholder"
      class="mt-2 sm:col-span-2"
    />

    <!-- residence input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="residence"
      type="text"
      title="patients.residence-address"
      inputPlaceholder="patients.residence-address-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />

    <!-- email input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="gmail"
      type="email"
      title="patients.email-address"
      inputPlaceholder="patients.email-address-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />

    <!-- bloodtype selector -->
    <comboboxes-input
      v-model:currentSelected="currentBloodType"
      :data="bloodType"
      title="patients.blood-type"
      placeholder="patients.blood-type-placeholder"
      class="mt-2 sm:col-span-2"
    />
    <comboboxes-input
      v-model:currentSelected="currentPatientType"
      :data="patientType"
      title="patients.patient-type"
      placeholder="patients.patient-type-placeholder"
      class="mt-2 sm:col-span-2"
    />
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref, watchEffect, computed } from "vue";
import { usePatientsStore } from "@stores/patientsStore.js";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import * as yup from "yup";

import ActionButtonOutlineIcon from "@components/forms/ActionButtonOutlinedIcon.vue";
import CustomLabel from "@/components/forms/CustomLabel.vue";
import TextInput from "@components/forms/TextInput.vue";
import RadioGroup from "@components/forms/RadioGroup.vue";
import ComboboxesInput from "@components/forms/ComboboxesInput.vue";

const { t } = useI18n();

const patientsStore = usePatientsStore();
const { newPatientData } = storeToRefs(patientsStore);

const genders = [
  { id: 0, name: "patients.male" },
  { id: 1, name: "patients.female" },
];
const bloodType = [
  { id: 1, name: "A+" },
  { id: 2, name: "A-" },
  { id: 3, name: "B+" },
  { id: 4, name: "B-" },
  { id: 5, name: "AB+" },
  { id: 6, name: "AB-" },
  { id: 7, name: "O+" },
  { id: 8, name: "O-" },
];
const patientType = [
  { id: 1, name: t("patients.regular") },
  { id: 2, name: t("patients.emergency") },
  { id: 3, name: t("patients.cronic") },
  { id: 4, name: t("patients.growth-control") },
  { id: 5, name: t("patients.vaccination") },
  { id: 6, name: t("patients.neonatal") },
  { id: 7, name: t("patients.teenager") },
  { id: 8, name: t("patients.specialty") },
];
const insurances = [
  { id: 0, name: "insurance 1" },
  { id: 1, name: "insurance 2" },
  { id: 3, name: "insurance 3" },
  { id: 4, name: "insurance 4" },
  { id: 5, name: "insurance 5" },
  { id: 6, name: "insurance 6" },
];
const alergies = [
  { id: 0, name: "Alergia 1" },
  { id: 1, name: "Alergia 2" },
  { id: 3, name: "Alergia 3" },
  { id: 4, name: "Alergia 4" },
  { id: 5, name: "Alergia 5" },
  { id: 6, name: "Alergia 6" },
];
const syndrome = [
  { id: 0, name: "Sindrome 1" },
  { id: 1, name: "Sindrome 2" },
  { id: 3, name: "Sindrome 3" },
  { id: 4, name: "Sindrome 4" },
  { id: 5, name: "Sindrome 5" },
  { id: 6, name: "Sindrome 6" },
];
const yesnoOptions = [
  { id: 0, name: "general.yes" },
  { id: 1, name: "general.no" },
];

// Inicializar listas
const contactInformationList = ref(newPatientData.value.contactInformationList ?? []);
const phoneList = ref(newPatientData.value.phoneList ?? []);

const initialValues = computed(() => {
  const base = {
    names: newPatientData?.value.names || "",
    lastNames: newPatientData?.value.lastNames || "",
    birthdate: newPatientData?.value.birthdate || "",
    pediatrician: newPatientData?.value.pediatrician || "",
    residence: newPatientData?.value.residence || "",
    gmail: newPatientData?.value.gmail || "",
  };

  // Agregar datos de contactos
  if (newPatientData.value.contactInformationList?.length) {
    newPatientData.value.contactInformationList.forEach((contact) => {
      base[`contact_name_${contact.id}`] = contact.name || "";
      base[`contact_lastname_${contact.id}`] = contact.lastName || "";
      base[`relation_${contact.id}`] = contact.type || "";

      // Agregar teléfonos del contacto
      contact.phones?.forEach((phone) => {
        base[`contact_${contact.id}_phone_${phone.id}`] = phone.value || "";
      });

      // Agregar emails del contacto
      contact.emails?.forEach((email) => {
        base[`contact_${contact.id}_email_${email.id}`] = email.value || "";
      });
    });
  }

  return base;
});

const currentGender = ref(newPatientData.value.currentGender ?? 1);
const hasAlergies = ref(newPatientData.value.hasAlergies ?? 1);
const hasSyndromes = ref(newPatientData.value.hasSyndromes ?? 1);
const currentAlergies = ref(newPatientData.value.currentAlergies ?? []);
const currentSyndromes = ref(newPatientData.value.currentSyndromes ?? []);
const currentInsurance = ref(newPatientData.value.currentInsurance ?? []);
const currentBloodType = ref(newPatientData.value.currentBloodType ?? []);
const currentPatientType = ref(newPatientData.value.currentPatientType ?? []);

function addContact() {
  const newId = Date.now();
  contactInformationList.value.push({
    id: newId,
    name: "",
    lastName: "",
    type: "",
    phones: [],
    emails: [],
  });
  setFieldValue(`contact_name_${newId}`, "");
  setFieldValue(`contact_lastname_${newId}`, "");
  setFieldValue(`relation_${newId}`, "");
}

function deleteContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  
  // Limpiar campos del formulario
  if (contact) {
    delete values[`contact_name_${contactId}`];
    delete values[`contact_lastname_${contactId}`];
    delete values[`relation_${contactId}`];
    
    contact.phones?.forEach((phone) => {
      delete values[`contact_${contactId}_phone_${phone.id}`];
    });
    
    contact.emails?.forEach((email) => {
      delete values[`contact_${contactId}_email_${email.id}`];
    });
  }
  
  contactInformationList.value = contactInformationList.value.filter(
    (c) => c.id !== contactId
  );
}

function addPhoneToContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact) {
    const newPhoneId = Date.now();
    if (!contact.phones) contact.phones = [];
    contact.phones.push({ id: newPhoneId, value: "" });
    setFieldValue(`contact_${contactId}_phone_${newPhoneId}`, "");
  }
}

function deletePhoneFromContact(contactId, phoneId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact && contact.phones) {
    contact.phones = contact.phones.filter((p) => p.id !== phoneId);
    delete values[`contact_${contactId}_phone_${phoneId}`];
  }
}

function addEmailToContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact) {
    const newEmailId = Date.now();
    if (!contact.emails) contact.emails = [];
    contact.emails.push({ id: newEmailId, value: "" });
    setFieldValue(`contact_${contactId}_email_${newEmailId}`, "");
  }
}

function deleteEmailFromContact(contactId, emailId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact && contact.emails) {
    contact.emails = contact.emails.filter((e) => e.id !== emailId);
    delete values[`contact_${contactId}_email_${emailId}`];
  }
}

// Validation Schema Dinámico
const validationSchema = computed(() => {
  const schema = {
    // Validaciones base del paciente
    names: yup.string().required(t("vee-validate.required-input")),
    lastNames: yup.string().required(t("vee-validate.required-input")),
    birthdate: yup.date().required(t("vee-validate.required-input")),
    pediatrician: yup.string().required(t("vee-validate.required-input")),
    residence: yup.string().required(t("vee-validate.required-input")),
    gmail: yup
      .string()
      .email(t("vee-validate.invalid-email"))
      .required(t("vee-validate.required-input")),
  };

  // Validaciones para contactos
  contactInformationList.value.forEach((contact) => {
    // Nombre del contacto (requerido)
    schema[`contact_name_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    // Apellido del contacto (requerido)
    schema[`contact_lastname_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    // Tipo de relación (requerido)
    schema[`relation_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    // Validaciones para teléfonos del contacto
    contact.phones?.forEach((phone) => {
      schema[`contact_${contact.id}_phone_${phone.id}`] = yup
        .string()
        .matches(/^[0-9+\-() ]+$/, t("vee-validate.invalid-phone"))
        .min(7, t("vee-validate.phone-min-length"))
        .required(t("vee-validate.required-input"));
    });

    // Validaciones para emails del contacto
    contact.emails?.forEach((email) => {
      schema[`contact_${contact.id}_email_${email.id}`] = yup
        .string()
        .email(t("vee-validate.invalid-email"))
        .required(t("vee-validate.required-input"));
    });
  });

  return yup.object(schema);
});

const { values, errors, setFieldValue } = useForm({
  initialValues,
  validationSchema,
});

const isFormValid = computed(() => {
  const hasNoErrors = Object.keys(errors.value).length === 0;
  const hasRequiredFields = 
    values.names &&
    values.lastNames &&
    values.birthdate &&
    values.pediatrician &&
    values.residence &&
    values.gmail;
  
  // Validar que al menos haya un teléfono del paciente
  const hasPatientPhone = phoneList.value.length > 0 && 
    phoneList.value.some(p => values[`phone_${p.id}`]);
  
  return hasNoErrors && hasRequiredFields && hasPatientPhone;
});

// Computed para generar el array de contactos en el formato requerido
const formattedContacts = computed(() => {
  return contactInformationList.value.map((contact) => {
    // Recopilar teléfonos del contacto
    const phones = contact.phones
      ?.map((phone) => {
        const fieldKey = `contact_${contact.id}_phone_${phone.id}`;
        return values[fieldKey] || "";
      })
      .filter((phone) => phone !== "");

    // Recopilar emails del contacto
    const emails = contact.emails
      ?.map((email) => {
        const fieldKey = `contact_${contact.id}_email_${email.id}`;
        return values[fieldKey] || "";
      })
      .filter((email) => email !== "");

    return {
      type: values[`relation_${contact.id}`] || "",
      name: values[`contact_name_${contact.id}`] || "",
      lastName: values[`contact_lastname_${contact.id}`] || "",
      phones: phones || [],
      emails: emails || [],
    };
  });
});

watchEffect(() => {
  newPatientData.value = {
    Name: values.names,
    LastName: values.lastNames,
    Birthdate: values.birthdate,
    Gender: currentGender.value,
    Address: values.residence, 
    Alergies: hasAlergies.value == 1 ? currentAlergies.value : [],
    Syndromes: hasSyndromes.value == 1 ? currentSyndromes.value : [],
    Pediatrician: values.pediatrician,
    Contacts: formattedContacts.value,
    InsuranceId: currentInsurance.value,
    BloodTypeId: currentBloodType.value,
    PatientTypeId: currentPatientType.value,
    isFormValid: isFormValid.value,
    // Guardar también las listas para persistencia
    contactInformationList: contactInformationList.value,
  };
});

// Actualizar valores de contactos
watchEffect(() => {
  contactInformationList.value.forEach((contact) => {
    // Actualizar nombre, apellido y tipo
    const nameKey = `contact_name_${contact.id}`;
    const lastNameKey = `contact_lastname_${contact.id}`;
    const relationKey = `relation_${contact.id}`;
    
    if (values[nameKey] !== undefined) contact.name = values[nameKey];
    if (values[lastNameKey] !== undefined) contact.lastName = values[lastNameKey];
    if (values[relationKey] !== undefined) contact.type = values[relationKey];

    // Actualizar teléfonos del contacto
    contact.phones?.forEach((phone) => {
      const phoneKey = `contact_${contact.id}_phone_${phone.id}`;
      if (values[phoneKey] !== undefined) phone.value = values[phoneKey];
    });

    // Actualizar emails del contacto
    contact.emails?.forEach((email) => {
      const emailKey = `contact_${contact.id}_email_${email.id}`;
      if (values[emailKey] !== undefined) email.value = values[emailKey];
    });
  });
});
</script>
