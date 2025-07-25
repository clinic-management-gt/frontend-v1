<template>
     <div class="ml-2 grid grid-cols-2 gap-2 ">
          <!-- name input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="names" type="text"
               title="patients.names" inputPlaceholder='patients.names-placeholder' class="mt-2 sm:col-span-2"
               inputColor="patient-page-color" />
          <!-- last name input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="lastNames" type="text"
               title="patients.lastNames" inputPlaceholder='patients.lastNames-placeholder' class="mt-2 sm:col-span-2"
               inputColor="patient-page-color" />
          <!-- birthdate input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="birthdate" type="date"
               title="patients.birthdate" inputPlaceholder='patients.birthdate' class="mt-2 sm:col-span-1"
               inputColor="patient-page-color" />
          <!-- gender input -->
          <radio-group title="patients.gender" :data="genders" v-model:currentSelected="currentGender"
               class="mt-2 col-span-2 sm:col-span-1" />

          <!-- alergies selector -->
          <radio-group title="patients.suffer-from-allergies" :data=" yesnoOptions"
               v-model:currentSelected="hasAlergies" class="mt-2 sm:col-span-2" />
          <div v-if="hasAlergies === 0" class="w-full col-span-2">
            <comboboxes-input :data="allPatients" v-model:currentSelected="currentAllergie" title="patients.alergies"
            placeholder="patients.alergies-placeholder" class="mt-2 sm:col-span-2" />
          </div>

          <!-- syndrome selector -->
          <radio-group title="patients.suffer-from-syndromes" :data="yesnoOptions"
               v-model:currentSelected="hasSyndromes" class="mt-2 sm:col-span-2" />
          <div v-if="hasSyndromes === 0 " class="w-full col-span-2">
            <comboboxes-input :data="allPatients" v-model:currentSelected="currentAllergie" title="patients.syndrome"
            placeholder="patients.syndrome-placeholder" class="mt-2 sm:col-span-2" />
          </div>

          <!-- pediatrician input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="pediatrician" type="text"
               title="patients.family-pediatrician" inputPlaceholder='patients.pediatrician-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />

          <!-- mother input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="mother" type="text"
               title="patients.mother-information" inputPlaceholder='patients.parents-information-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />

          <!-- father input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="father" type="text"
               title="patients.father-information" inputPlaceholder='patients.parents-information-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />

          <!-- phone input -->
           <div class="sm:col-span-2 space-y-2">
            <div class="flex items-center items-start">
              <custom-label  title="patients.phone-contact" :is-required="true" />
              <action-button-outline-icon  icon="PlusIcon" color="text-patient-page-color"/>
            </div>
            <div class="flex items-centers items-start gap-2 ml-6">
              <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="phone" type="number"
              inputPlaceholder='patients.phone-contact-placeholder' inputColor="patient-page-color" class="w-full"/>
              <action-button-outline-icon  icon="TrashIcon" color="text-red-500"/>
            </div>
           </div>

          <!-- insurance selector -->
          <comboboxes-input :data="allPatients" v-model:currentSelected="currentAllergie" title="patients.insurance"
               placeholder="patients.insurance-placeholder" class="mt-2 sm:col-span-2" />

          <!-- residence input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="residence" type="text"
               title="patients.residence-address" inputPlaceholder='patients.residence-address-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />

          <!-- email input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="gmail" type="text"
               title="patients.email-address" inputPlaceholder='patients.email-address-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
     </div>
</template>
<script setup>
import { useForm } from 'vee-validate'
import { ref, watchEffect, computed, watch } from 'vue'
import { usePatientsStore } from '@stores/patientsStore.js'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'

import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'
import ActionButtonOutlineIcon from '@components/forms/ActionButtonOutlinedIcon.vue'
import CustomLabel from '@/components/forms/CustomLabel.vue'
import TextInput from '@components/forms/TextInput.vue'
import RadioGroup from '@components/forms/RadioGroup.vue'
import ComboboxesInput from '@components/forms/ComboboxesInput.vue'

const patientsStore = usePatientsStore()
const { newPatientData } = storeToRefs(patientsStore)


const currentGender = ref()
const hasAlergies = ref()
const hasSyndromes = ref()

const genders = [
     { id: 0, name: "patients.male" },
     { id: 1, name: "patients.female" }
]
const yesnoOptions = [
     { id: 0, name: "general.yes" },
     { id: 1, name: "general.no" }
]
console.log("aver", newPatientData.value.names)

const initialValues = computed(() => ({
  names: newPatientData?.value.names || '',
  lastNames: newPatientData?.value.lastNames || '',
  birthdate: newPatientData?.value.birthdate || '',
  pediatrician: newPatientData?.value.pediatrician || '',
  mother: newPatientData?.value.mother || '',
  father: newPatientData?.value.father || '',
  residence: newPatientData?.value.residence || '',
  gmail: newPatientData?.value.gmail || '',
}))

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
  })
})
const isFormValid = computed(() => {
     return Object.keys(errors.value).length === 0 && values.names && values.lastNames && values.date && values.birthdate && values.pediatrician && values.mother && values.father && values.residence && values.gmail
})

watchEffect(() => {
  newPatientData.value = {
    names: values.names,
    lastNames: values.lastNames,
    birthdate: values.birthdate,
    pediatrician: values.pediatrician,
    mother: values.mother,
    father: values.father,
    residence: values.residence,
    gmail: values.gmail,
  }
})
</script>
