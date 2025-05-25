<template>
     <div v-if="currentPatientSelected" class="relative w-full h-full bg-cover bg-center"
          style="background-image: url('/logo-gastro.png');">
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div class="relative z-10 flex items-center justify-center h-full">
               <div class="text-white text-center">
                    <patients-search />
               </div>
          </div>
     </div>
     <div v-else>
          <div class="px-6 py-8 mx-auto grid grid-cols-5 grid-rows-5 gap-5">
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
                    <patient-data-sheet-box />
               </div>
               <div class="col-span-3 row-span-3 col-start-3 row-start-3 rounded-xl">
                    <patient-history-log-box :data="historyLog"/>
               </div>
          </div>
     </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePatientsStore } from "@stores/patientsStore";

import PatientsSearch from "@components/patientsComponents/PatientsSearch.vue";
import PatientMainDataBox from "@components/patientsComponents/PatientMainDataBox.vue";
import PatientContactDataBox from "@components/patientsComponents/PatientContactDataBox.vue";
import PatientDataSheetBox from "@components/patientsComponents/PatientDataSheetBox.vue";
import PatientImportantInformationBox from "@components/patientsComponents/PatientImportantInformationBox.vue";
import PatientHistoryLogBox from "../components/patientsComponents/PatientHistoryLogBox.vue";


const patientsStore = usePatientsStore()
patientsStore.fetchAllPatients()
const { currentPatientSelected } = storeToRefs(patientsStore)

const test = {
     "id": 1,
     "name": "Oscar Francisco",
     "lastName": "Pop Sagastume",
     "birthdate": "2015-06-01T00:00:00",
     "address": "Calle Falsa 123",
     "gender": "Female",
     "bloodTypeId": 1,
     "patientTypeId": 1,
     "createdAt": "2025-05-17T16:40:46.848374",
     "updatedAt": null
}

const contact = {
     0: {
          "parent": "Argelia Sagastume",
          "phone": "+(502) 1234 5678",
          "gmail": "vanessasagastume05@gmail.com"
     },
     1: {
          "parent": "Oscar Pop",
          "phone": "+(502) 1234 5678",
          "gmail": "vanessasagastume05@gmail.com"
     }
}

const information = {
     "lastVisit": "2015-06-01T00:00:00",
     "birthdate": "2015-06-01T00:00:00",
     "alergies": [
          "no alergies",
     ],
     "syndrome": [
          "no syndrome",
     ]
}

const historyLog = [
     { id: 1, date: "2021-05-24T00:00:00" },
     { id: 2, date: "2021-05-26T00:00:00" },
     { id: 3, date: "2021-05-29T00:00:00" },
     { id: 4, date: "2021-06-01T00:00:00" },
     { id: 5, date: "2021-06-03T00:00:00" },
     { id: 6, date: "2021-06-06T00:00:00" },
     { id: 7, date: "2022-06-09T00:00:00" },
     { id: 8, date: "2022-06-11T00:00:00" },
     { id: 9, date: "2022-06-14T00:00:00" },
     { id: 10, date: "2022-06-17T00:00:00" },
     { id: 11, date: "2022-06-19T00:00:00" },
     { id: 12, date: "2022-06-22T00:00:00" },
     { id: 13, date: "2023-06-25T00:00:00" },
     { id: 14, date: "2023-06-28T00:00:00" },
     { id: 15, date: "2023-07-01T00:00:00" },
     { id: 16, date: "2023-07-04T00:00:00" },
     { id: 17, date: "2024-07-07T00:00:00" },
     { id: 18, date: "2024-07-10T00:00:00" },
     { id: 19, date: "2024-07-13T00:00:00" },
     { id: 20, date: "2025-07-16T00:00:00" },
     { id: 21, date: "2025-07-19T00:00:00" }
]



</script>