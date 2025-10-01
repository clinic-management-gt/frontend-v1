<template>
  <general-dialog-modal
    ref="createDialog"
    :isOpen="isOpen"
    dialogSize="max-w-6xl"
    @close-modal="handleClose"
  >
    <template #title>
      <div class="flex justify-between items-center px-6 py-2">
        <div>
          <p class="text-xl">
            {{ $t("patients.data-sheet") }}
          </p>
        </div>
        <button
          class="text-black hover:text-gray-400 text-3xl font-bold leading-none"
          @click="handleClose"
        >
          ×
        </button>
      </div>
    </template>
    <template #body>
      <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1 flex flex-col space-y-4">
          <app-panel panelDesign="overflow-hidden rounded-lg bg-white shadow-md px-4 py-5 sm:p-6">
            <p class="font-bold">
              {{ $t("patients.patients-data") }}
            </p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <div
                v-for="(item, index) in patientInfo"
                :key="index"
                class="flex"
              >
                <p class="font-thin text-gray-600 mr-2">
                  {{ $t(item.label) }}:
                </p>
                <p>{{ item.value }}</p>
              </div>
            </div>
          </app-panel>
        </div>

        <div class="w-full flex flex-col space-y-4">
          <div v-for="(item, index) in displayData" :key="index" class="flex flex-col w-full">
            <Disclosure v-slot="{ open, close }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-white shadow-md px-4 py-2 text-left font-medium text-black hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                @click="handleDisclosureClick(index)"
              >
                <span>{{ item.title }}</span>
                <ChevronDownIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-patient-page-color"
                />
              </DisclosureButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <DisclosurePanel v-show="displayData[index].isOpen" class="px-4 pb-2 pt-4 text-sm text-gray-500">
                  <div v-for="e in item.value" :key="e.id" class="exam-item mb-4">
                    <span v-if="item.key === 'exams'" class="flex justify-between">
                      <div>
                        <p class="font-semibold text-md">{{ e.examName }}</p>
                        <p>{{ e.resultText }}</p>
                      </div>
                      <div class="flex flex-row space-x-2 items-center">
                        <p class="text-sm text-gray-500">{{ formatDateShortest(e.createdAt) }}</p>
                        <button v-if="e.hasAction" @click="downloadExam(e.resultFilePath)">
                          <ActionButtonOutlinedIcon 
                          icon="ArrowDownTrayIcon"
                          size="h-6 w-6 mr-1"
                          color="text-patient-page-color"
                          />
                        </button>
                      </div>
                    </span>
                    <span v-else-if="item.key === 'vaccines'" class="flex justify-between">
                      <div>
                        <p class="font-semibold">{{ e.vaccineName }}</p>
                        <p>{{ e.brand }}</p>
                        <p>{{ $t('patients.dosis')}}: {{ e.dosis }}</p>
                      </div>
                      <div>
                        <p>{{ $t('patients.application-age') }}: {{ e.ageAtApplication }}</p>
                        <p>{{ $t('patients.application-date') }}: {{ e.applicationDate }}</p>
                      </div>
                    </span>
                  </div>
                </DisclosurePanel>
              </transition>
            </Disclosure>
          </div>
        </div>
      </div>
    </template>
  </general-dialog-modal>
</template>
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { usePatientsStore } from "@stores/patientsStore.js";
import { useFileStore } from '@stores/FileStore';
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { formatDateShortest } from "@/utils/isoFormatDate.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import AppPanel from "@components/forms/AppPanel.vue";
import ActionButtonOutlinedIcon from "@components/forms/ActionButtonOutlinedIcon.vue";

const { t } = useI18n();

const patientsStore = usePatientsStore();
const { currentPatientSelectedData } = storeToRefs(patientsStore);

const patientsLogicStore = usePatientsLogicStore();
const { showDataSheetPatientDialog } = storeToRefs(patientsLogicStore);
const { closeAllPatientDialog } = usePatientsLogicStore();


const { downloadFile } = useFileStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
});
function handleClose() {
  closeAllPatientDialog();
};

const patientInfo = computed(() => [ { label: "general.first-name", value: patientData.value?.name ?? "" }, { label: "general.last-name", value: patientData.value?.lastName ?? "" }, { label: "general.birthdate", value: patientData.value?.birthdate ?? "" }, { label: "general.insurance", value: patientData.value?.insurances[0].providerName?? "" }, { label: "general.family-pediatrician", value: patientData.value?.familyPediatrician ?? t('general.nodata') , }, { label: "general.sex", value: patientData.value?.gender ?? t('general.nodata') }, ]);

const patientData = computed(() => currentPatientSelectedData.value);

const patientExams = computed(() => {
  return patientData.value?.patientExams.map((exam, index) => {
    return {
      id: index + 1, 
      examName: exam.examName,
      resultText: exam.resultText,
      resultFilePath: exam.resultFilePath,
      createdAt: exam.createdAt,
      hasAction: exam.resultFilePath ? true : false, 
    };
  }) ?? []; 
});

const patientVaccine = computed(() => {
  return patientData.value?.patientVaccines.map((exam, index) => {
    return {
      id: index + 1, 
      ageAtApplication: exam.ageAtApplication,
      applicationDate: exam.applicationDate,
      brand: exam.brand,
      dosis: exam.dosis,
      vaccineName: exam.vaccineName
    };
  }) ?? []; 
});

const displayData = computed(() => [
  { key: 'record', title: t('patients.record'), isOpen: false, value: "" },
  { key: 'current-illnesses', title: t('patients.current-illnesses'), isOpen: false, value: "" },
  { key: 'vaccines', title: t('patients.vaccines'), isOpen: false, value: patientVaccine.value },
  { key: 'exams', title: t('patients.exams'), isOpen: false, value: patientExams.value },
  { key: 'record', title: t('patients.laboratories'), isOpen: false, value: "" },
]);

const activeDisclosureIndex = ref(null);

const handleDisclosureClick = (index) => {
  displayData.value.forEach((item, idx) => {
    if (idx !== index) {
      item.isOpen = false;
    }
  });

  displayData.value[index].isOpen = !displayData.value[index].isOpen;
};

// Función para descargar el archivo
const downloadExam = (filePath) => {
  if (filePath) {
    downloadFile(filePath);
  }
};
</script>
