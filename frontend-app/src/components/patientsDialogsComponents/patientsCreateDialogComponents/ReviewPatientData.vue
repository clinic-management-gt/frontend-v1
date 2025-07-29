<template>
  <div>
    <div class="ml-2 max-lg:mt-2 lg:col-span-1">
      <p class="text-base/7 font-semibold text-gray-500">{{ $t('patients.revise-patients-data') }}</p>
      <hr class="border-t border-gray-200" />
        <dl class="mt-2 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <div v-for="(item, idx) in patientSummary" :key="idx"
              :class="['flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4', item.css]">
            <dt class="text-sm/6 text-gray-600">{{ $t(item.name) }}</dt>
            <dd class="order-first text-lg font-semibold tracking-tight text-gray-900">
              {{ item.isI18n ? $t(item.value) : item.value || '-' }}
            </dd>
          </div>
        </dl>
      <h2 class="text-sm/6 text-gray-900 pt-2">{{$t('patients.phone-contact')}}</h2>
      <div v-for="(item, index) in patientPhoneList" :key="index" class="relative flex gap-x-4">
        <div class="relative flex size-6 flex-none items-center justify-center bg-white">
          <div class="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
        </div>
        <p class="flex-auto py-0.5 text-xs/5 text-gray-500">
          <span class="text-lg font-semibold font-medium text-gray-900">
            {{ item }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePatientsStore } from '@stores/patientsStore.js'
import { isoFormatDate } from '@utils/isoFormatDate';
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue';

const patientsStore = usePatientsStore()
const { newPatientData } = storeToRefs(patientsStore)

const patientSummary = computed(() => {
  return [
    { name: 'general.full-name', value: `${newPatientData.value.names} ${newPatientData.value.lastNames }`, css: "col-span-2"},
    { name: 'patients.birthdate', value: isoFormatDate(newPatientData.value.birthdate).longSpanishDate },
    { name: 'patients.gender', value: newPatientData.value.currentGender === 1 ? 'general.male' : 'general.female', isI18n: true},
    { name: 'patients.family-pediatrician', value: newPatientData.value.pediatrician },
    { name: 'patients.insurance', value: newPatientData.value.insurance },
    { name: 'patients.mother', value: newPatientData.value.mother },
    { name: 'patients.father', value: newPatientData.value.father },
    { name: 'patients.residence-address', value: newPatientData.value.residence },
    { name: 'patients.email-address', value: newPatientData.value.gmail },
  ]
})

const patientPhoneList = computed(() => {
  return newPatientData.value.phoneList.map(item => Number(item.phone))
})



</script>
