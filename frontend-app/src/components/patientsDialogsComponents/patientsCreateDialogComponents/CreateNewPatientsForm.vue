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

    <!-- mother input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="mother"
      type="text"
      title="patients.mother-information"
      inputPlaceholder="patients.parents-information-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />

    <!-- father input -->
    <text-input
      inputClassError="ring-yellow-300 focus:ring-yellow-600"
      name="father"
      type="text"
      title="patients.father-information"
      inputPlaceholder="patients.parents-information-placeholder"
      class="mt-2 sm:col-span-2"
      inputColor="patient-page-color"
    />

    <!-- phone input -->
    <div class="sm:col-span-2 space-y-2">
      <div class="flex items-center items-start">
        <custom-label
          title="patients.phone-contact"
          :isRequired="true"
        />
        <action-button-outline-icon
          icon="PlusIcon"
          color="text-patient-page-color"
          @click="addPhone()"
        />
      </div>
      <div
        v-for="item in phoneList"
        :key="item.id"
        class="flex items-centers items-start gap-2 ml-6"
      >
        <text-input
          inputClassError="ring-yellow-300 focus:ring-yellow-600"
          :name="`phone_${item.id}`"
          type="number"
          inputPlaceholder="patients.phone-contact-placeholder"
          inputColor="patient-page-color"
          class="w-full"
        />
        <action-button-outline-icon
          icon="TrashIcon"
          color="text-red-500"
          @click="deletePhone(item.id)"
        />
      </div>
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
      type="text"
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

const initialValues = computed(() => {
  const base = {
    names: newPatientData?.value.names || "",
    lastNames: newPatientData?.value.lastNames || "",
    birthdate: newPatientData?.value.birthdate || "",
    pediatrician: newPatientData?.value.pediatrician || "",
    mother: newPatientData?.value.mother || "",
    father: newPatientData?.value.father || "",
    residence: newPatientData?.value.residence || "",
    gmail: newPatientData?.value.gmail || "",
  };

  if (newPatientData.value.phoneList?.length) {
    newPatientData.value.phoneList.forEach((item) => {
      base[`phone_${item.id}`] = item.phone || "";
    });
  }

  return base;
});

const currentGender = ref(newPatientData.value.currentGender ?? null);
const currentAlergies = ref(newPatientData.value.currentAlergies ?? []);
const currentSyndromes = ref(newPatientData.value.currentSyndromes ?? []);
const currentInsurance = ref(newPatientData.value.currentInsurance ?? []);
const currentBloodType = ref(newPatientData.value.currentBloodType ?? []);
const phoneList = ref(newPatientData.value.phoneList ?? []);
const hasAlergies = ref(newPatientData.value.hasAlergies ?? null);
const hasSyndromes = ref(newPatientData.value.hasSyndromes ?? null);

function addPhone() {
  const newId = Date.now();
  phoneList.value.push({ id: newId, phone: "" });
  setFieldValue(`phone_${newId}`, "");
}
function deletePhone(id) {
  phoneList.value = phoneList.value.filter((p) => Number(p.id) !== Number(id));
  delete values[`phone_${id}`];
}

const { values, errors, setFieldValue } = useForm({
  initialValues,
  validationSchema: yup.object({
    names: yup.string().required(),
    lastNames: yup.string().required(),
    birthdate: yup.date().required(),
    pediatrician: yup.string().required(),
    mother: yup.string().required(),
    father: yup.string().required(),
    residence: yup.string().required(),
    gmail: yup.string().required(),
  }),
});
const isFormValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 &&
    values.names &&
    values.lastNames &&
    values.date &&
    values.birthdate &&
    values.pediatrician &&
    values.mother &&
    values.father &&
    values.residence &&
    values.gmail
  );
});

watchEffect(() => {
  newPatientData.value = {
    Name: values.names,
    LastName: values.lastNames,
    Birthdate: values.birthdate,
    Gender: currentGender.value,
    HasAlergies: hasAlergies.value,
    HasSyndromes: hasSyndromes.value,
    Pediatrician: values.pediatrician,
    MotherInfo: values.mother,
    FatherInfo: values.father,
    ContactPhones: phoneList.value,
    Insurance: currentInsurance.value,
    ResidenceAddress: values.residence,
    ContactEmail: values.gmail,
    BloodTypeId: values.gmail,
    PatientTypeId: values.gmail,
    isFormValid: isFormValid.value,
  };
});
watchEffect(() => {
  phoneList.value.forEach((item) => {
    const fieldKey = `phone_${item.id}`;
    const fieldValue = values[fieldKey];

    if (fieldValue !== undefined && fieldValue !== item.phone) {
      item.phone = fieldValue;
    }
  });
});
</script>
