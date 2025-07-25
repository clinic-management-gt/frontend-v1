<template>
  <div>
    <div class="max-lg:mt-16 lg:col-span-1">
          <p class="text-base/7 font-semibold text-gray-500">{{ $t('patients.revise-patients-data') }}</p>
          <hr class="mt-2border-t border-gray-200" />
            <dl class="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div v-for="(item, idx) in patientSummary" :key="idx"
                  :class="['flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4', item.css]">
                <dt class="text-sm/6 text-gray-600">{{ $t(item.name) }}</dt>
                <dd class="order-first text-lg font-semibold tracking-tight text-gray-900">
                  {{ item.value || '-' }}
                </dd>
              </div>
            </dl>
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
    { name: 'patients.gender', value: newPatientData.value.value },
    { name: 'patients.family-pediatrician', value: newPatientData.value.pediatrician },
    { name: 'patients.mother', value: newPatientData.value.mother },
    { name: 'patients.father', value: newPatientData.value.father },
    { name: 'patients.phone-contact', value: newPatientData.value.phone },
    { name: 'patients.insurance', value: newPatientData.value.insurance },
    { name: 'patients.residence-address', value: newPatientData.value.residence },
    { name: 'patients.email-address', value: newPatientData.value.gmail },
  ]
})



</script>
