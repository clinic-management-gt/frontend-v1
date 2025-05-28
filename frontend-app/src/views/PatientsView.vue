<template>
     <div>
          <div class="px-6 py-8 mx-auto grid grid-cols-5 grid-rows-5 gap-5">
               <!-- Datos principales -->
               <div class="col-span-5 bg-gray-100 rounded-xl">
                    <patient-main-data-box :data="test" />
               </div>
               <div class="col-span-2 row-span-2 row-start-2 bg-gray-100 rounded-xl">
                    <patient-important-information-box :data="information" />
               </div>
               <div class="col-span-2 row-span-2 col-start-1 row-start-4 bg-gray-100 rounded-xl">
                    <patient-contact-data-box :data="contact" />
               </div>
               <div class="col-span-3 col-start-3 row-start-2 bg-gray-100 rounded-xl">
                    <patient-data-sheet-box :data="test" />
               </div>
               <div class="col-span-3 row-span-3 col-start-3 row-start-3 rounded-xl">
                    <patient-history-log-box :data="historyLog"/>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { usePatientsStore } from "@stores/patientsStore";

import PatientMainDataBox from "@components/patientsComponents/PatientMainDataBox.vue";
import PatientContactDataBox from "@components/patientsComponents/PatientContactDataBox.vue";
import PatientDataSheetBox from "@components/patientsComponents/PatientDataSheetBox.vue";
import PatientImportantInformationBox from "@components/patientsComponents/PatientImportantInformationBox.vue";
import PatientHistoryLogBox from "../components/patientsComponents/PatientHistoryLogBox.vue";

// Inicializa el store y obtén las referencias
const patientsStore = usePatientsStore();
const { currentPatientSelectedId, currentPatientSelectedData, currentPatientMedicalRecords } = storeToRefs(patientsStore);

// Data de ejemplo para mostrar mientras no hay paciente seleccionado
const test = ref({
    name: "Vista Previa",
    lastName: "de Paciente",
    birthdate: "2020-01-01T00:00:00",
    gender: "Not Specified"
});

const contact = ref({
    0: {
        parent: "Contacto de Ejemplo",
        phone: "+(502) XXXX-XXXX",
        gmail: "ejemplo@correo.com"
    }
});

const information = ref({
    lastVisit: "2024-01-01T00:00:00",
    birthdate: "2020-01-01T00:00:00",
    alergies: ["Vista previa"],
    syndrome: ["de historia clínica"]
});

const historyLog = ref([
    { id: 1, date: "2024-01-01T00:00:00" },
    { id: 2, date: "2024-02-01T00:00:00" }
]);
</script>