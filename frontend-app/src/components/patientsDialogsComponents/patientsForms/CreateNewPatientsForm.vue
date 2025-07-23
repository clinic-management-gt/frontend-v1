<template>
     <div class="ml-2 grid grid-cols-2 gap-2">
          <!-- name input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="text"
               title="patients.names" inputPlaceholder='patients.names-placeholder' class="mt-2 sm:col-span-2"
               inputColor="patient-page-color" />
          <!-- last name input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="text"
               title="patients.lastNames" inputPlaceholder='patients.lastNames-placeholder' class="mt-2 sm:col-span-2"
               inputColor="patient-page-color" />
          <!-- birthdate input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="date"
               title="patients.birthdate" inputPlaceholder='patients.birthdate' class="mt-2 sm:col-span-1"
               inputColor="patient-page-color" />
          <!-- gender input -->
          <radio-group title="patients.gender" :data="genders" v-model:currentSelected="currentGender"
               class="mt-2 col-span-2 sm:col-span-1" />

          <!-- alergies selector -->
          <radio-group title="patients.suffer-from-allergies" :data=" yesnoOptions"
               v-model:currentSelected="currentGender" class="mt-2 sm:col-span-2" />
          <!-- falta el selector -->

          <!-- syndrome selector -->
          <radio-group title="patients.suffer-from-syndromes" :data="yesnoOptions"
               v-model:currentSelected="currentGender" class="mt-2 sm:col-span-2" />
          <!-- falta el selector  -->

          <!-- pediatrician input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="text"
               title="patients.family-pediatrician" inputPlaceholder='patients.pediatrician-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
          <!-- mother input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="text"
               title="patients.mother-information" inputPlaceholder='patients.parents-information-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
          <!-- father input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="text"
               title="patients.father-information" inputPlaceholder='patients.parents-information-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
          <!-- phone input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="number"
               title="patients.phone-contact" inputPlaceholder='patients.phone-contact-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
          <!-- insurance selector -->


          <!-- residence input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="number"
               title="patients.residence-address" inputPlaceholder='patients.residence-address-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />
          <!-- email input -->
          <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="number"
               title="patients.email-address" inputPlaceholder='patients.email-address-placeholder'
               class="mt-2 sm:col-span-2" inputColor="patient-page-color" />



     </div>
</template>
<script setup>
import { useForm } from 'vee-validate'
import { ref, watchEffect, computed, watch } from 'vue'
import { usePatientsLogicStore } from '@stores/patientsLogicStore.js'
import { storeToRefs } from 'pinia'

import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue'
import ActionButtonOutlineIcon from '@components/forms/ActionButtonOutlinedIcon.vue'
import TextInput from '@components/forms/TextInput.vue'
import RadioGroup from '@components/forms/RadioGroup.vue'


// import * as yup from 'yup'

const currentGender = ref(1)

const genders = [
     { id: 0, name: "patients.male" },
     { id: 1, name: "patients.female" }
]
const yesnoOptions = [
     { id: 0, name: "general.yes" },
     { id: 1, name: "general.no" }
]
</script>