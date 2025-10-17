<template>
  <form class="ml-2 grid grid-cols-2 gap-2" @submit.prevent>
    <!-- name input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="names"
      type="text"
      title="patients.names"
      inputPlaceholder="patients.names-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
      :required="true"
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
      :required="true"
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
      :required="true"
    />
    <!-- gender input -->
    <radio-group
      v-model:currentSelected="currentGender"
      title="patients.gender"
      :data="genders"
      class="mt-2 col-span-2 sm:col-span-1"
      :required="true"
    />
    <!-- pediatrician input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="pediatrician"
      type="text"
      title="patients.family-pediatrician"
      inputPlaceholder="patients.pediatrician-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
      :required="true"
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
      :required="true"
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
        :required="true"
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
        :required="true"
      />
    </div>

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
          @click.prevent.stop="addContact()"
        />
      </div>
      
      <div
        v-for="contact in contactInformationList"
        :key="contact.id"
        class="rounded-lg p-4 space-y-3 bg-gray-50"
      >
        <div class="flex items-center justify-between border-b border-gray-300 pb-2">
          <p class="text-sm font-semibold text-gray-700">
            {{ $t('patients.contact') }} #{{ contactInformationList.indexOf(contact) + 1 }}
          </p>
          <action-button-outline-icon
            icon="TrashIcon"
            color="text-red-500"
            @click.prevent.stop="deleteContact(contact.id)"
          />
        </div>

        <!-- Nombre y Apellido del contacto -->
        <div class="grid grid-cols-2 gap-3">
          <text-input
            inputClassError="ring-yellow-30 0 focus:ring-yellow-600"
            :name="`contact_name_${contact.id}`"
            type="text"
            title="patients.contact-name"
            inputPlaceholder="patients.contact-information-placeholder"
            inputColor="patient-page-color"
            :required="true"
          />
          <text-input
            inputClassError="ring-yellow-300 focus:ring-yellow-600"
            :name="`contact_lastname_${contact.id}`"
            type="text"
            title="patients.contact-lastname"
            inputPlaceholder="patients.contact-lastname-placeholder"
            inputColor="patient-page-color"
            :required="true"
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
          :required="true"
        />

        <!-- Teléfonos del contacto -->
        <div class="space-y-2 bg-white p-3 rounded border border-gray-200">
          <div class="flex items-center justify-between">
            <span class="flex">
              <span class="text-red-500">*</span>
              <p class="text-sm font-medium text-gray-700">
                {{ $t('patients.phone-contact') }}
              </p>
            </span>
            <action-button-outline-icon
              icon="PlusIcon"
              color="text-patient-page-color"
              @click.prevent.stop="addPhoneToContact(contact.id)"
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
              @click.prevent.stop="deletePhoneFromContact(contact.id, phone.id)"
            />
          </div>
        </div>

        <!-- Emails del contacto -->
        <div class="space-y-2 bg-white p-3 rounded border border-gray-200">
          <div class="flex items-center justify-between">
            <span class="flex">
              <span class="text-red-500">*</span>
              <p class="text-sm font-medium text-gray-700">
                {{ $t('patients.email-address') }}
              </p>
            </span>
            <action-button-outline-icon
              icon="PlusIcon"
              color="text-patient-page-color"
              @click.prevent.stop="addEmailToContact(contact.id)"
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
              @click.prevent.stop="deleteEmailFromContact(contact.id, email.id)"
            />
          </div>
        </div>
      </div>

      <span
        v-if="contactInformationList.length === 0"
        class="text-sm text-gray-400 italic text-center"
      >
        {{ $t('patients.no-contacts-added') }}
      </span>
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
      :required="true"
    />
  </form>
</template>

<script setup>
import { useForm } from "vee-validate";
import { ref, watch, computed, nextTick } from "vue";
import { usePatientsStore } from "@stores/patientsStore.js";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import * as yup from "yup";
import { useDebounceFn } from "@vueuse/core";

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

const contactInformationList = ref(newPatientData.value.contactInformationList ?? []);

const initialValues = computed(() => {
  const base = {
    names: newPatientData?.value.names || "",
    lastNames: newPatientData?.value.lastNames || "",
    birthdate: newPatientData?.value.birthdate || "",
    pediatrician: newPatientData?.value.pediatrician || "",
    residence: newPatientData?.value.residence || "",
  };

  if (newPatientData.value.contactInformationList?.length) {
    newPatientData.value.contactInformationList.forEach((contact) => {
      base[`contact_name_${contact.id}`] = contact.name || "";
      base[`contact_lastname_${contact.id}`] = contact.lastName || "";
      base[`relation_${contact.id}`] = contact.type || "";

      contact.phones?.forEach((phone) => {
        base[`contact_${contact.id}_phone_${phone.id}`] = phone.value || "";
      });

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

async function addContact() {
  const newId = Date.now();
  contactInformationList.value.push({
    id: newId,
    name: "",
    lastName: "",
    type: "",
    phones: [],
    emails: [],
  });
  
  await nextTick();
  
  setFieldValue(`contact_name_${newId}`, "");
  setFieldValue(`contact_lastname_${newId}`, "");
  setFieldValue(`relation_${newId}`, "");
}

async function deleteContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  
  if (contact) {
    setFieldValue(`contact_name_${contactId}`, undefined);
    setFieldValue(`contact_lastname_${contactId}`, undefined);
    setFieldValue(`relation_${contactId}`, undefined);
    
    contact.phones?.forEach((phone) => {
      setFieldValue(`contact_${contactId}_phone_${phone.id}`, undefined);
    });
    
    contact.emails?.forEach((email) => {
      setFieldValue(`contact_${contactId}_email_${email.id}`, undefined);
    });
  }
  
  contactInformationList.value = contactInformationList.value.filter(
    (c) => c.id !== contactId
  );
  
  await nextTick();
}

async function addPhoneToContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact) {
    const newPhoneId = Date.now();
    if (!contact.phones) contact.phones = [];
    contact.phones.push({ id: newPhoneId, value: "" });
    
    await nextTick();
    setFieldValue(`contact_${contactId}_phone_${newPhoneId}`, "");
  }
}

async function deletePhoneFromContact(contactId, phoneId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact && contact.phones) {
    setFieldValue(`contact_${contactId}_phone_${phoneId}`, undefined);
    contact.phones = contact.phones.filter((p) => p.id !== phoneId);
    await nextTick();
  }
}

async function addEmailToContact(contactId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact) {
    const newEmailId = Date.now();
    if (!contact.emails) contact.emails = [];
    contact.emails.push({ id: newEmailId, value: "" });
    
    await nextTick();
    setFieldValue(`contact_${contactId}_email_${newEmailId}`, "");
  }
}

async function deleteEmailFromContact(contactId, emailId) {
  const contact = contactInformationList.value.find((c) => c.id === contactId);
  if (contact && contact.emails) {
    setFieldValue(`contact_${contactId}_email_${emailId}`, undefined);
    contact.emails = contact.emails.filter((e) => e.id !== emailId);
    await nextTick();
  }
}

const validationSchema = computed(() => {
  const schema = {
    names: yup.string().required(t("vee-validate.required-input")),
    lastNames: yup.string().required(t("vee-validate.required-input")),
    birthdate: yup.date().required(t("vee-validate.required-input")),
    pediatrician: yup.string().required(t("vee-validate.required-input")),
    residence: yup.string().required(t("vee-validate.required-input")),
  };

  contactInformationList.value.forEach((contact) => {
    schema[`contact_name_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    schema[`contact_lastname_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    schema[`relation_${contact.id}`] = yup
      .string()
      .required(t("vee-validate.required-input"));

    contact.phones?.forEach((phone) => {
      schema[`contact_${contact.id}_phone_${phone.id}`] = yup
        .string()
        .matches(/^[0-9+\-() ]+$/, t("vee-validate.invalid-phone"))
        .min(7, t("vee-validate.phone-min-length"))
        .required(t("vee-validate.required-input"));
    });

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
    values.residence;

  if (contactInformationList.value.length === 0) {
    return hasNoErrors && hasRequiredFields;
  }

  const contactsValid = contactInformationList.value.every((contact) => {
    const hasName = values[`contact_name_${contact.id}`]?.trim();
    const hasLastName = values[`contact_lastname_${contact.id}`]?.trim();
    const hasRelation = values[`relation_${contact.id}`]?.trim();
    
    // Al menos un teléfono válido
    const hasValidPhone = contact.phones?.some((phone) => {
      const phoneValue = values[`contact_${contact.id}_phone_${phone.id}`]?.trim();
      return phoneValue && phoneValue.length >= 7;
    });
    
    // Al menos un email válido
    const hasValidEmail = contact.emails?.some((email) => {
      const emailValue = values[`contact_${contact.id}_email_${email.id}`]?.trim();
      return emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    });

    return hasName && hasLastName && hasRelation && hasValidPhone && hasValidEmail;
  });
  return hasNoErrors && hasRequiredFields && contactsValid;
});

const formattedContacts = computed(() => {
  return contactInformationList.value.map((contact) => {
    const phones = contact.phones
      ?.map((phone) => {
        const fieldKey = `contact_${contact.id}_phone_${phone.id}`;
        return values[fieldKey] || "";
      })
      .filter((phone) => phone !== "");

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

const updateStoreData = () => {
  Object.assign(newPatientData.value, {
    Name: values.names,
    LastName: values.lastNames,
    Birthdate: values.birthdate,
    Gender: currentGender.value,
    Address: values.residence,
    Alergies: hasAlergies.value === 0 ? currentAlergies.value : [],
    Syndromes: hasSyndromes.value === 0 ? currentSyndromes.value : [],
    Pediatrician: values.pediatrician,
    Contacts: formattedContacts.value,
    InsuranceId: currentInsurance.value,
    BloodTypeId: currentBloodType.value,
    PatientTypeId: currentPatientType.value,
    isFormValid: isFormValid.value,
    contactInformationList: contactInformationList.value,
  });
};

const debouncedUpdate = useDebounceFn(updateStoreData, 300);

watch(
  [
    () => values.names,
    () => values.lastNames,
    () => values.birthdate,
    () => values.pediatrician,
    () => values.residence,
    currentGender,
    hasAlergies,
    hasSyndromes,
    currentAlergies,
    currentSyndromes,
    currentInsurance,
    currentBloodType,
    currentPatientType,
  ],
  () => {
    debouncedUpdate();
  }
);

watch(
  [contactInformationList, formattedContacts],
  () => {
    // Actualizar datos locales de contactos
    contactInformationList.value.forEach((contact) => {
      const nameKey = `contact_name_${contact.id}`;
      const lastNameKey = `contact_lastname_${contact.id}`;
      const relationKey = `relation_${contact.id}`;
      
      if (values[nameKey] !== undefined) contact.name = values[nameKey];
      if (values[lastNameKey] !== undefined) contact.lastName = values[lastNameKey];
      if (values[relationKey] !== undefined) contact.type = values[relationKey];

      contact.phones?.forEach((phone) => {
        const phoneKey = `contact_${contact.id}_phone_${phone.id}`;
        if (values[phoneKey] !== undefined) phone.value = values[phoneKey];
      });

      contact.emails?.forEach((email) => {
        const emailKey = `contact_${contact.id}_email_${email.id}`;
        if (values[emailKey] !== undefined) email.value = values[emailKey];
      });
    });

    debouncedUpdate();
  }
);

watch(isFormValid, (newValue) => {
  if (newPatientData.value) {
    newPatientData.value.isFormValid = newValue;
  }
});
</script>
