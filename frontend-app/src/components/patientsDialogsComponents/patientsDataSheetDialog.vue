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
          <div
            v-for="(item, index) in displayData"
            :key="index"
            class="flex flex-col w-full"
          >
            <Disclosure>
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-white shadow-md px-4 py-2 text-left font-medium text-black hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                @click="handleDisclosureClick(index)"
              >
                <span>{{ item.title }}</span>
                <ChevronDownIcon
                  :class="isDisclosureOpen(index) ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-patient-page-color"
                />
              </DisclosureButton>
              <transition
                enterActiveClass="transition duration-100 ease-out"
                enterFromClass="transform scale-95 opacity-0"
                enterToClass="transform scale-100 opacity-100"
                leaveActiveClass="transition duration-75 ease-out"
                leaveFromClass="transform scale-100 opacity-100"
                leaveToClass="transform scale-95 opacity-0"
              >
                <DisclosurePanel
                  v-show="isDisclosureOpen(index)"
                  class="px-4 pb-2 pt-4 text-sm text-gray-500"
                >
                  <!-- Loading state -->
                  <div
                    v-if="item.key === 'first-medical-record' && medicalRecordStore.isLoadingMedicalRecords"
                    class="text-center py-4"
                  >
                    <p>{{ $t('general.loading') }}...</p>
                  </div>
                  
                  <!-- No data message -->
                  <div
                    v-else-if="!item.value || item.value.length === 0"
                    class="text-center py-4"
                  >
                    <p>{{ $t('general.nodata') }}</p>
                  </div>
                  
                  <!-- First Medical Record -->
                  <div
                    v-else-if="item.key === 'first-medical-record'"
                    class="space-y-3"
                  >
                    <div
                      v-for="record in item.value"
                      :key="record.id"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <div class="flex justify-between items-start mb-3">
                        <p class="font-semibold text-gray-700">
                          {{ $t('patients.first-visit-notes') }}
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ formatDateShortest(record.createdAt) }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <div
                          v-if="record.notes"
                          class="text-gray-700"
                        >
                          <p class="font-medium text-sm mb-1">
                            {{ $t('patients.notes') }}:
                          </p>
                          <p class="whitespace-pre-wrap">
                            {{ record.notes }}
                          </p>
                        </div>
                        <div
                          v-if="record.familyHistory"
                          class="text-gray-700"
                        >
                          <p class="font-medium text-sm mb-1">
                            {{ $t('patients.family-history') }}:
                          </p>
                          <p class="whitespace-pre-wrap">
                            {{ record.familyHistory }}
                          </p>
                        </div>
                        <div class="flex gap-4 text-sm text-gray-600">
                          <span v-if="record.weight">
                            <span class="font-medium">{{ $t('patients.weight') }}:</span> {{ record.weight }} kg
                          </span>
                          <span v-if="record.height">
                            <span class="font-medium">{{ $t('patients.height') }}:</span> {{ record.height }} cm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Exams -->
                  <template v-else-if="item.key === 'exams'">
                    <div
                      v-for="e in item.value"
                      :key="e.id"
                      class="exam-item mb-4"
                    >
                      <span class="flex justify-between">
                        <div>
                          <p class="font-semibold text-md">
                            {{ e.examName }}
                          </p>
                          <p>{{ e.resultText }}</p>
                        </div>
                        <div class="flex flex-row space-x-2 items-center">
                          <p class="text-sm text-gray-500">
                            {{ formatDateShortest(e.createdAt) }}
                          </p>
                          <button
                            v-if="e.hasAction"
                            @click="downloadExam(e.resultFilePath)"
                          >
                            <ActionButtonOutlinedIcon 
                              icon="ArrowDownTrayIcon"
                              size="h-6 w-6 mr-1"
                              color="text-patient-page-color"
                            />
                          </button>
                        </div>
                      </span>
                    </div>
                  </template>
                  
                  <!-- Vaccines -->
                  <template v-else-if="item.key === 'vaccines'">
                    <div
                      v-for="e in item.value"
                      :key="e.id"
                      class="exam-item mb-4"
                    >
                      <span class="flex justify-between">
                        <div>
                          <p class="font-semibold">
                            {{ e.vaccineName }}
                          </p>
                          <p>{{ e.brand }}</p>
                          <p>{{ $t('patients.dosis') }}: {{ e.dosis }}</p>
                        </div>
                        <div>
                          <p>{{ $t('patients.application-age') }}: {{ e.ageAtApplication }}</p>
                          <p>{{ $t('patients.application-date') }}: {{ e.applicationDate }}</p>
                        </div>
                      </span>
                    </div>
                  </template>
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
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { usePatientsLogicStore } from "@stores/patientsLogicStore.js";
import { usePatientsStore } from "@stores/patientsStore.js";
import { useFileStore } from '@stores/fileStore';
import { useMedicalRecordStore } from '@stores/medicalRecordStore.js';
import { computed, ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { formatDateShortest } from "@/utils/isoFormatDate.js";

import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import AppPanel from "@components/forms/AppPanel.vue";
import ActionButtonOutlinedIcon from "@components/forms/ActionButtonOutlinedIcon.vue";

const { t } = useI18n();

const patientsStore = usePatientsStore();
const { currentPatientSelectedData } = storeToRefs(patientsStore);
const { closeAllPatientDialog } = usePatientsLogicStore();

const medicalRecordStore = useMedicalRecordStore();
const { downloadFile } = useFileStore();

// Estado para el primer Medical Record
const firstMedicalRecord = ref(null);

// Estado para controlar qué acordeones están abiertos
const openDisclosures = ref({});

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
});

function handleClose() {
  // Limpiar estado al cerrar
  openDisclosures.value = {};
  firstMedicalRecord.value = null;
  closeAllPatientDialog();
};

const patientData = computed(() => currentPatientSelectedData.value);

const patientInfo = computed(() => [ 
  { label: "general.first-name", value: patientData.value?.name ?? "" }, 
  { label: "general.last-name", value: patientData.value?.lastName ?? "" }, 
  { label: "general.birthdate", value: patientData.value?.birthdate ?? "" }, 
  { label: "general.insurance", value: patientData.value?.insurances?.[0]?.providerName ?? "" }, 
  { label: "general.family-pediatrician", value: patientData.value?.familyPediatrician ?? t('general.nodata') }, 
  { label: "general.sex", value: patientData.value?.gender ?? t('general.nodata') }, 
]);

// Función para obtener el primer Medical Record del paciente
async function fetchFirstMedicalRecord(patientId) {
  if (!patientId) return;
  
  firstMedicalRecord.value = null;
  const record = await medicalRecordStore.fetchFirstMedicalRecord(patientId);
  firstMedicalRecord.value = record;
}

// Watch para cargar el primer medical record cuando se abre el diálogo
watch([() => props.isOpen, () => patientData.value?.id], ([isOpen, patientId]) => {
  if (isOpen && patientId) {
    fetchFirstMedicalRecord(patientId);
  }
}, { immediate: true });

// Ejecutar al montar el componente si el diálogo ya está abierto
onMounted(() => {
  if (props.isOpen && patientData.value?.id) {
    fetchFirstMedicalRecord(patientData.value.id);
  }
});

// Watch para limpiar el estado cuando cambie el paciente
watch(() => patientData.value?.id, () => {
  // Limpiar estado al cambiar de paciente
  openDisclosures.value = {};
  firstMedicalRecord.value = null;
}, { immediate: false });

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
  { 
    key: 'first-medical-record', 
    title: t('patients.first-medical-record'), 
    value: firstMedicalRecord.value ? [{
      id: 1,
      notes: firstMedicalRecord.value.notes || t('general.nodata'),
      weight: firstMedicalRecord.value.weight,
      height: firstMedicalRecord.value.height,
      familyHistory: firstMedicalRecord.value.familyHistory,
      createdAt: firstMedicalRecord.value.createdAt
    }] : []
  },
  { key: 'current-illnesses', title: t('patients.current-illnesses'), value: "" },
  { key: 'vaccines', title: t('patients.vaccines'), value: patientVaccine.value },
  { key: 'exams', title: t('patients.exams'), value: patientExams.value },
  { key: 'record', title: t('patients.laboratories'), value: "" },
]);

const handleDisclosureClick = (index) => {
  // Toggle el estado del acordeón seleccionado
  openDisclosures.value[index] = !openDisclosures.value[index];
  
  // Cerrar todos los demás acordeones
  Object.keys(openDisclosures.value).forEach((key) => {
    if (parseInt(key) !== index) {
      openDisclosures.value[key] = false;
    }
  });
};

// Función para verificar si un disclosure está abierto
const isDisclosureOpen = (index) => {
  return openDisclosures.value[index] || false;
};

// Función para descargar el archivo
const downloadExam = (filePath) => {
  if (filePath) {
    downloadFile(filePath);
  }
};
</script>
