<template>
     <div class=" top-16 w-72">
          <Combobox v-model="selected" @update:modelValue="onSelect">
               <div class="relative mt-1">
                    <div
                         class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                         <ComboboxInput
                              class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                              :displayValue="(person) => displayText(person)"
                              @change="query = $event.target.value" />
                         <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                         </ComboboxButton>
                    </div>
                    <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
                         @after-leave="query = ''">
                         <ComboboxOptions
                              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                              <div v-if="filteredPeople.length === 0 && query !== ''"
                                   class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                   Nothing found.
                              </div>

                              <ComboboxOption v-for="person in filteredPeople" as="template" :key="person.id"
                                   :value="person" v-slot="{ selected, active }">
                                   <li class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{
                                        'bg-teal-600 text-white': active,
                                        'text-gray-900': !active,
                                   }">
                                        <span class="block truncate"
                                             :class="{ 'font-medium': selected, 'font-normal': !selected }">
                                             {{ person.name }} {{ person.lastName }} ({{ person.gender }})
                                        </span>
                                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3"
                                             :class="{ 'text-white': active, 'text-teal-600': !active }">
                                             <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                        </span>
                                   </li>
                              </ComboboxOption>
                         </ComboboxOptions>
                    </TransitionRoot>
               </div>
          </Combobox>
     </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const emit = defineEmits(['update:currentSelected'])
const props = defineProps({
     data: {
          type: [Array, String, Object],
          default: []
     },
     currentSelected: {
          type: Number,
          default: undefined
     }
})
console.log(props.data)

const people = [
     {
          "id": 1,
          "name": "María",
          "lastName": "Gómez",
          "birthdate": "2015-06-01T00:00:00",
          "address": "Calle Falsa 123",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.848374",
          "updatedAt": null
     },
     {
          "id": 2,
          "name": "Juan",
          "lastName": "Pérez",
          "birthdate": "1990-04-15T00:00:00",
          "address": "Av. Central 456",
          "gender": "Male",
          "bloodTypeId": 2,
          "patientTypeId": 2,
          "createdAt": "2025-05-17T16:40:46.848816",
          "updatedAt": null
     },
     {
          "id": 3,
          "name": "Juan",
          "lastName": "González",
          "birthdate": "1992-03-24T00:00:00",
          "address": "Av. Flores 454",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.849044",
          "updatedAt": null
     },
     {
          "id": 4,
          "name": "Lucía",
          "lastName": "Fernández",
          "birthdate": "1985-11-23T00:00:00",
          "address": "Calle del Sol 789",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.849246",
          "updatedAt": null
     },
     {
          "id": 5,
          "name": "Carlos",
          "lastName": "Ramírez",
          "birthdate": "2000-02-10T00:00:00",
          "address": "Boulevard Norte 321",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 2,
          "createdAt": "2025-05-17T16:40:46.849431",
          "updatedAt": null
     },
     {
          "id": 6,
          "name": "Ana",
          "lastName": "Martínez",
          "birthdate": "2012-07-30T00:00:00",
          "address": "Callejón Luna 12",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.849615",
          "updatedAt": null
     },
     {
          "id": 7,
          "name": "Diego",
          "lastName": "López",
          "birthdate": "1978-09-12T00:00:00",
          "address": "Av. Las Rosas 555",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 2,
          "createdAt": "2025-05-17T16:40:46.849847",
          "updatedAt": null
     },
     {
          "id": 8,
          "name": "Sofía",
          "lastName": "Torres",
          "birthdate": "1995-01-05T00:00:00",
          "address": "Calle Primavera 77",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.850048",
          "updatedAt": null
     },
     {
          "id": 9,
          "name": "Miguel",
          "lastName": "Castro",
          "birthdate": "2003-12-22T00:00:00",
          "address": "Camino Real 888",
          "gender": "Male",
          "bloodTypeId": 7,
          "patientTypeId": 2,
          "createdAt": "2025-05-17T16:40:46.850224",
          "updatedAt": null
     },
     {
          "id": 10,
          "name": "Valentina",
          "lastName": "Mendoza",
          "birthdate": "2018-03-18T00:00:00",
          "address": "Calle Sauce 303",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.85039",
          "updatedAt": null
     },
     {
          "id": 11,
          "name": "Andrés",
          "lastName": "Morales",
          "birthdate": "1980-06-29T00:00:00",
          "address": "Pasaje del Río 47",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 2,
          "createdAt": "2025-05-17T16:40:46.85056",
          "updatedAt": null
     },
     {
          "id": 12,
          "name": "Camila",
          "lastName": "Silva",
          "birthdate": "1999-10-09T00:00:00",
          "address": "Av. Libertad 910",
          "gender": "Female",
          "bloodTypeId": 4,
          "patientTypeId": 1,
          "createdAt": "2025-05-17T16:40:46.850743",
          "updatedAt": null
     },
     {
          "id": 13,
          "name": "Anette",
          "lastName": "Legister",
          "birthdate": "1993-02-08T00:00:00",
          "address": "72636 Dakota Park",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 3,
          "createdAt": "2019-02-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 14,
          "name": "Karlie",
          "lastName": "Brook",
          "birthdate": "2013-06-18T00:00:00",
          "address": "1061 Lindbergh Junction",
          "gender": "Female",
          "bloodTypeId": 7,
          "patientTypeId": 3,
          "createdAt": "2023-02-21T00:00:00",
          "updatedAt": null
     },
     {
          "id": 15,
          "name": "Dorotea",
          "lastName": "Pierce",
          "birthdate": "2010-06-10T00:00:00",
          "address": "4030 Melvin Park",
          "gender": "Female",
          "bloodTypeId": 7,
          "patientTypeId": 7,
          "createdAt": "2022-03-14T00:00:00",
          "updatedAt": null
     },
     {
          "id": 16,
          "name": "Corbin",
          "lastName": "Orwell",
          "birthdate": "1998-01-11T00:00:00",
          "address": "9 Springview Place",
          "gender": "Male",
          "bloodTypeId": 7,
          "patientTypeId": 2,
          "createdAt": "2016-04-05T00:00:00",
          "updatedAt": null
     },
     {
          "id": 17,
          "name": "Maribel",
          "lastName": "Emery",
          "birthdate": "2013-09-25T00:00:00",
          "address": "601 Meadow Ridge Alley",
          "gender": "Female",
          "bloodTypeId": 7,
          "patientTypeId": 5,
          "createdAt": "2018-05-02T00:00:00",
          "updatedAt": null
     },
     {
          "id": 18,
          "name": "Jaquith",
          "lastName": "Woodwin",
          "birthdate": "2005-02-10T00:00:00",
          "address": "1 Weeping Birch Circle",
          "gender": "Female",
          "bloodTypeId": 4,
          "patientTypeId": 2,
          "createdAt": "2022-12-30T00:00:00",
          "updatedAt": null
     },
     {
          "id": 19,
          "name": "Stefa",
          "lastName": "Fortesquieu",
          "birthdate": "2000-11-19T00:00:00",
          "address": "4632 Novick Place",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 2,
          "createdAt": "2022-10-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 20,
          "name": "Franz",
          "lastName": "Hancorn",
          "birthdate": "2004-12-06T00:00:00",
          "address": "1 Stephen Pass",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 7,
          "createdAt": "2020-09-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 21,
          "name": "Dane",
          "lastName": "Renbold",
          "birthdate": "2005-02-25T00:00:00",
          "address": "9 Russell Parkway",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 1,
          "createdAt": "2017-09-01T00:00:00",
          "updatedAt": null
     },
     {
          "id": 22,
          "name": "Wilmar",
          "lastName": "Upcraft",
          "birthdate": "2014-12-06T00:00:00",
          "address": "1213 Esker Center",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 3,
          "createdAt": "2020-07-30T00:00:00",
          "updatedAt": null
     },
     {
          "id": 23,
          "name": "Nye",
          "lastName": "Futty",
          "birthdate": "2012-05-23T00:00:00",
          "address": "3747 Talmadge Circle",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 3,
          "createdAt": "2022-01-16T00:00:00",
          "updatedAt": null
     },
     {
          "id": 24,
          "name": "Taryn",
          "lastName": "Laidler",
          "birthdate": "2017-11-06T00:00:00",
          "address": "7588 Golf Course Parkway",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 5,
          "createdAt": "2016-05-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 25,
          "name": "Janelle",
          "lastName": "Kun",
          "birthdate": "2013-01-15T00:00:00",
          "address": "4 Golf View Parkway",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 3,
          "createdAt": "2016-11-13T00:00:00",
          "updatedAt": null
     },
     {
          "id": 26,
          "name": "Arne",
          "lastName": "Streeting",
          "birthdate": "1992-02-05T00:00:00",
          "address": "4045 Carey Avenue",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 6,
          "createdAt": "2024-02-25T00:00:00",
          "updatedAt": null
     },
     {
          "id": 27,
          "name": "Orazio",
          "lastName": "Grioli",
          "birthdate": "2011-05-27T00:00:00",
          "address": "227 Ryan Alley",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 4,
          "createdAt": "2017-07-11T00:00:00",
          "updatedAt": null
     },
     {
          "id": 28,
          "name": "Shell",
          "lastName": "Ebenezer",
          "birthdate": "1994-11-02T00:00:00",
          "address": "4173 Cambridge Avenue",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 1,
          "createdAt": "2023-02-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 29,
          "name": "Shem",
          "lastName": "Maulin",
          "birthdate": "2001-08-08T00:00:00",
          "address": "7 Clemons Hill",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 7,
          "createdAt": "2016-10-07T00:00:00",
          "updatedAt": null
     },
     {
          "id": 30,
          "name": "Jakie",
          "lastName": "Giraudo",
          "birthdate": "2009-04-23T00:00:00",
          "address": "2 Boyd Plaza",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 6,
          "createdAt": "2015-11-14T00:00:00",
          "updatedAt": null
     },
     {
          "id": 31,
          "name": "Gilburt",
          "lastName": "Picott",
          "birthdate": "1998-06-27T00:00:00",
          "address": "7146 Jay Hill",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 3,
          "createdAt": "2020-03-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 32,
          "name": "Lyn",
          "lastName": "Oganesian",
          "birthdate": "2012-03-04T00:00:00",
          "address": "4 Gulseth Trail",
          "gender": "Female",
          "bloodTypeId": 4,
          "patientTypeId": 8,
          "createdAt": "2020-01-06T00:00:00",
          "updatedAt": null
     },
     {
          "id": 33,
          "name": "Myrna",
          "lastName": "Scheffel",
          "birthdate": "2002-04-24T00:00:00",
          "address": "8436 Prairieview Way",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 3,
          "createdAt": "2019-05-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 34,
          "name": "Stanislaw",
          "lastName": "Kalinke",
          "birthdate": "1998-05-29T00:00:00",
          "address": "703 Maywood Place",
          "gender": "Male",
          "bloodTypeId": 8,
          "patientTypeId": 3,
          "createdAt": "2021-02-06T00:00:00",
          "updatedAt": null
     },
     {
          "id": 35,
          "name": "Orren",
          "lastName": "Warhurst",
          "birthdate": "2011-09-19T00:00:00",
          "address": "49 Westend Trail",
          "gender": "Male",
          "bloodTypeId": 8,
          "patientTypeId": 5,
          "createdAt": "2021-01-28T00:00:00",
          "updatedAt": null
     },
     {
          "id": 36,
          "name": "Sheffie",
          "lastName": "Ruller",
          "birthdate": "2002-12-06T00:00:00",
          "address": "48 Montana Point",
          "gender": "Male",
          "bloodTypeId": 7,
          "patientTypeId": 8,
          "createdAt": "2018-06-11T00:00:00",
          "updatedAt": null
     },
     {
          "id": 37,
          "name": "Chuck",
          "lastName": "Reymers",
          "birthdate": "1999-05-27T00:00:00",
          "address": "8555 Browning Avenue",
          "gender": "Male",
          "bloodTypeId": 2,
          "patientTypeId": 3,
          "createdAt": "2023-02-25T00:00:00",
          "updatedAt": null
     },
     {
          "id": 38,
          "name": "Jocelyne",
          "lastName": "Clayson",
          "birthdate": "2017-07-07T00:00:00",
          "address": "1868 Judy Lane",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 3,
          "createdAt": "2017-02-15T00:00:00",
          "updatedAt": null
     },
     {
          "id": 39,
          "name": "Zolly",
          "lastName": "Marre",
          "birthdate": "2010-07-21T00:00:00",
          "address": "28 Swallow Point",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 3,
          "createdAt": "2022-03-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 40,
          "name": "Urbano",
          "lastName": "Klimuk",
          "birthdate": "2005-08-16T00:00:00",
          "address": "14 Morrow Center",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 4,
          "createdAt": "2018-05-17T00:00:00",
          "updatedAt": null
     },
     {
          "id": 41,
          "name": "Helena",
          "lastName": "Kubach",
          "birthdate": "2015-02-22T00:00:00",
          "address": "0 Kensington Pass",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 2,
          "createdAt": "2018-10-12T00:00:00",
          "updatedAt": null
     },
     {
          "id": 42,
          "name": "Donni",
          "lastName": "Piller",
          "birthdate": "2014-06-13T00:00:00",
          "address": "7041 Graceland Drive",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 6,
          "createdAt": "2017-05-14T00:00:00",
          "updatedAt": null
     },
     {
          "id": 43,
          "name": "Tabby",
          "lastName": "Gallego",
          "birthdate": "1999-09-02T00:00:00",
          "address": "26350 Pine View Park",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 1,
          "createdAt": "2018-08-04T00:00:00",
          "updatedAt": null
     },
     {
          "id": 44,
          "name": "Dev",
          "lastName": "Patience",
          "birthdate": "1994-09-18T00:00:00",
          "address": "46 Namekagon Drive",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 7,
          "createdAt": "2019-02-11T00:00:00",
          "updatedAt": null
     },
     {
          "id": 45,
          "name": "Gasparo",
          "lastName": "Bromley",
          "birthdate": "1998-04-13T00:00:00",
          "address": "69 Straubel Street",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 4,
          "createdAt": "2018-02-09T00:00:00",
          "updatedAt": null
     },
     {
          "id": 46,
          "name": "Darrel",
          "lastName": "Ten Broek",
          "birthdate": "2003-06-19T00:00:00",
          "address": "7327 Browning Plaza",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 8,
          "createdAt": "2019-01-17T00:00:00",
          "updatedAt": null
     },
     {
          "id": 47,
          "name": "Addie",
          "lastName": "Hammonds",
          "birthdate": "2013-06-27T00:00:00",
          "address": "00594 Ludington Pass",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 7,
          "createdAt": "2016-06-30T00:00:00",
          "updatedAt": null
     },
     {
          "id": 48,
          "name": "Renaud",
          "lastName": "Kinzel",
          "birthdate": "2013-12-18T00:00:00",
          "address": "2 Pankratz Hill",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 2,
          "createdAt": "2021-09-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 49,
          "name": "Rori",
          "lastName": "Arnatt",
          "birthdate": "1993-01-02T00:00:00",
          "address": "58 Anzinger Plaza",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 8,
          "createdAt": "2021-05-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 50,
          "name": "Si",
          "lastName": "Geoghegan",
          "birthdate": "1992-11-28T00:00:00",
          "address": "46 School Street",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 1,
          "createdAt": "2016-08-01T00:00:00",
          "updatedAt": null
     },
     {
          "id": 51,
          "name": "Feodora",
          "lastName": "McGillecole",
          "birthdate": "2014-07-11T00:00:00",
          "address": "9899 Old Gate Pass",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 4,
          "createdAt": "2015-08-31T00:00:00",
          "updatedAt": null
     },
     {
          "id": 52,
          "name": "Pat",
          "lastName": "Comini",
          "birthdate": "1999-01-14T00:00:00",
          "address": "31 Canary Point",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 2,
          "createdAt": "2020-03-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 53,
          "name": "Candide",
          "lastName": "Gaiger",
          "birthdate": "1998-02-22T00:00:00",
          "address": "2 Hollow Ridge Pass",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 4,
          "createdAt": "2019-12-10T00:00:00",
          "updatedAt": null
     },
     {
          "id": 54,
          "name": "Winnifred",
          "lastName": "Waszczykowski",
          "birthdate": "1998-03-23T00:00:00",
          "address": "69 Reindahl Center",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 4,
          "createdAt": "2019-12-16T00:00:00",
          "updatedAt": null
     },
     {
          "id": 55,
          "name": "Octavius",
          "lastName": "Iashvili",
          "birthdate": "2001-05-27T00:00:00",
          "address": "6619 Anthes Drive",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 4,
          "createdAt": "2017-05-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 56,
          "name": "Idalia",
          "lastName": "Zammitt",
          "birthdate": "2008-05-03T00:00:00",
          "address": "223 Gateway Street",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 4,
          "createdAt": "2017-10-28T00:00:00",
          "updatedAt": null
     },
     {
          "id": 57,
          "name": "Sheffield",
          "lastName": "Caspell",
          "birthdate": "2002-08-16T00:00:00",
          "address": "29951 Hauk Plaza",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 3,
          "createdAt": "2015-06-30T00:00:00",
          "updatedAt": null
     },
     {
          "id": 58,
          "name": "Garrick",
          "lastName": "Jiruca",
          "birthdate": "2010-01-13T00:00:00",
          "address": "9913 Troy Court",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 3,
          "createdAt": "2022-01-31T00:00:00",
          "updatedAt": null
     },
     {
          "id": 59,
          "name": "Tiphanie",
          "lastName": "Tuddenham",
          "birthdate": "1996-05-12T00:00:00",
          "address": "92619 Ridge Oak Drive",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 4,
          "createdAt": "2018-06-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 60,
          "name": "Judye",
          "lastName": "Begwell",
          "birthdate": "2012-07-26T00:00:00",
          "address": "2 Warner Trail",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 4,
          "createdAt": "2021-07-31T00:00:00",
          "updatedAt": null
     },
     {
          "id": 61,
          "name": "Maury",
          "lastName": "Battman",
          "birthdate": "2010-11-23T00:00:00",
          "address": "01712 Morning Circle",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 5,
          "createdAt": "2018-02-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 62,
          "name": "Abbe",
          "lastName": "Laise",
          "birthdate": "2013-04-06T00:00:00",
          "address": "7 Express Pass",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 7,
          "createdAt": "2022-02-12T00:00:00",
          "updatedAt": null
     },
     {
          "id": 63,
          "name": "Britta",
          "lastName": "Tebbutt",
          "birthdate": "2014-08-17T00:00:00",
          "address": "62008 Rowland Way",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 5,
          "createdAt": "2017-03-20T00:00:00",
          "updatedAt": null
     },
     {
          "id": 64,
          "name": "Cassi",
          "lastName": "Sabatier",
          "birthdate": "1995-08-03T00:00:00",
          "address": "0 Dunning Park",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 3,
          "createdAt": "2019-04-29T00:00:00",
          "updatedAt": null
     },
     {
          "id": 65,
          "name": "Rahel",
          "lastName": "Kedslie",
          "birthdate": "2010-08-25T00:00:00",
          "address": "7672 Oxford Hill",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 5,
          "createdAt": "2016-11-06T00:00:00",
          "updatedAt": null
     },
     {
          "id": 66,
          "name": "Athene",
          "lastName": "Deverill",
          "birthdate": "2015-07-09T00:00:00",
          "address": "8 Grasskamp Court",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 5,
          "createdAt": "2020-01-23T00:00:00",
          "updatedAt": null
     },
     {
          "id": 67,
          "name": "Carney",
          "lastName": "Santhouse",
          "birthdate": "2014-04-07T00:00:00",
          "address": "925 Transport Park",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 5,
          "createdAt": "2022-04-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 68,
          "name": "Perla",
          "lastName": "Oakenfall",
          "birthdate": "1996-06-21T00:00:00",
          "address": "0 Tennyson Plaza",
          "gender": "Female",
          "bloodTypeId": 3,
          "patientTypeId": 5,
          "createdAt": "2023-07-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 69,
          "name": "Adolph",
          "lastName": "Lambole",
          "birthdate": "1994-09-01T00:00:00",
          "address": "24 Duke Road",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 5,
          "createdAt": "2017-04-28T00:00:00",
          "updatedAt": null
     },
     {
          "id": 70,
          "name": "Cordey",
          "lastName": "Lagden",
          "birthdate": "1997-05-11T00:00:00",
          "address": "44 Monument Court",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 2,
          "createdAt": "2020-02-08T00:00:00",
          "updatedAt": null
     },
     {
          "id": 71,
          "name": "Jessalyn",
          "lastName": "Mose",
          "birthdate": "2015-08-17T00:00:00",
          "address": "9 Beilfuss Way",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 7,
          "createdAt": "2017-11-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 72,
          "name": "Kimbell",
          "lastName": "Gress",
          "birthdate": "2012-06-26T00:00:00",
          "address": "7 Kinsman Point",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 8,
          "createdAt": "2017-07-20T00:00:00",
          "updatedAt": null
     },
     {
          "id": 73,
          "name": "Olag",
          "lastName": "Juan",
          "birthdate": "1993-04-11T00:00:00",
          "address": "80055 Arrowood Drive",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 6,
          "createdAt": "2021-05-24T00:00:00",
          "updatedAt": null
     },
     {
          "id": 74,
          "name": "Earlie",
          "lastName": "Levesque",
          "birthdate": "2001-10-08T00:00:00",
          "address": "284 Green Point",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 3,
          "createdAt": "2017-10-30T00:00:00",
          "updatedAt": null
     },
     {
          "id": 75,
          "name": "Harp",
          "lastName": "Bartalini",
          "birthdate": "2012-07-24T00:00:00",
          "address": "62 Northport Crossing",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 4,
          "createdAt": "2016-12-12T00:00:00",
          "updatedAt": null
     },
     {
          "id": 76,
          "name": "Christopher",
          "lastName": "Shoppee",
          "birthdate": "1995-12-23T00:00:00",
          "address": "3 Oak Parkway",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 8,
          "createdAt": "2021-10-25T00:00:00",
          "updatedAt": null
     },
     {
          "id": 77,
          "name": "Sadie",
          "lastName": "Bohl",
          "birthdate": "2018-12-15T00:00:00",
          "address": "8548 Vernon Parkway",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 8,
          "createdAt": "2023-02-28T00:00:00",
          "updatedAt": null
     },
     {
          "id": 78,
          "name": "Niko",
          "lastName": "Meardon",
          "birthdate": "2020-01-28T00:00:00",
          "address": "57 Merrick Park",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 8,
          "createdAt": "2015-11-18T00:00:00",
          "updatedAt": null
     },
     {
          "id": 79,
          "name": "Daryn",
          "lastName": "Shelf",
          "birthdate": "2017-08-21T00:00:00",
          "address": "46924 Northland Alley",
          "gender": "Female",
          "bloodTypeId": 5,
          "patientTypeId": 7,
          "createdAt": "2021-08-25T00:00:00",
          "updatedAt": null
     },
     {
          "id": 80,
          "name": "Neila",
          "lastName": "M'Quharg",
          "birthdate": "2020-03-09T00:00:00",
          "address": "84 Nevada Drive",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 6,
          "createdAt": "2021-04-23T00:00:00",
          "updatedAt": null
     },
     {
          "id": 81,
          "name": "Tyrus",
          "lastName": "Howship",
          "birthdate": "2012-01-08T00:00:00",
          "address": "65945 Scofield Alley",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 5,
          "createdAt": "2019-09-12T00:00:00",
          "updatedAt": null
     },
     {
          "id": 82,
          "name": "Bertie",
          "lastName": "Boulstridge",
          "birthdate": "1990-06-22T00:00:00",
          "address": "28 Coleman Pass",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 5,
          "createdAt": "2018-10-19T00:00:00",
          "updatedAt": null
     },
     {
          "id": 83,
          "name": "Jeremiah",
          "lastName": "Cowely",
          "birthdate": "2000-10-06T00:00:00",
          "address": "9 Reinke Terrace",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 3,
          "createdAt": "2018-09-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 84,
          "name": "Gladi",
          "lastName": "Holson",
          "birthdate": "2003-05-07T00:00:00",
          "address": "2857 Lillian Point",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 7,
          "createdAt": "2019-06-05T00:00:00",
          "updatedAt": null
     },
     {
          "id": 85,
          "name": "Kimble",
          "lastName": "Dedmam",
          "birthdate": "2014-05-08T00:00:00",
          "address": "346 Warner Court",
          "gender": "Male",
          "bloodTypeId": 4,
          "patientTypeId": 3,
          "createdAt": "2019-02-17T00:00:00",
          "updatedAt": null
     },
     {
          "id": 86,
          "name": "Bart",
          "lastName": "McReath",
          "birthdate": "2016-04-03T00:00:00",
          "address": "5437 Chive Terrace",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 5,
          "createdAt": "2024-03-25T00:00:00",
          "updatedAt": null
     },
     {
          "id": 87,
          "name": "Thatcher",
          "lastName": "Braycotton",
          "birthdate": "1997-02-26T00:00:00",
          "address": "89 Talisman Drive",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 4,
          "createdAt": "2020-09-05T00:00:00",
          "updatedAt": null
     },
     {
          "id": 88,
          "name": "Reinald",
          "lastName": "Dickens",
          "birthdate": "2000-11-14T00:00:00",
          "address": "4 Park Meadow Pass",
          "gender": "Male",
          "bloodTypeId": 8,
          "patientTypeId": 1,
          "createdAt": "2024-01-27T00:00:00",
          "updatedAt": null
     },
     {
          "id": 89,
          "name": "Carey",
          "lastName": "Luke",
          "birthdate": "2001-09-01T00:00:00",
          "address": "101 Meadow Vale Avenue",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 4,
          "createdAt": "2017-12-09T00:00:00",
          "updatedAt": null
     },
     {
          "id": 90,
          "name": "Tiebold",
          "lastName": "Hryniewicki",
          "birthdate": "2006-04-20T00:00:00",
          "address": "0 Dorton Point",
          "gender": "Male",
          "bloodTypeId": 3,
          "patientTypeId": 2,
          "createdAt": "2020-05-24T00:00:00",
          "updatedAt": null
     },
     {
          "id": 91,
          "name": "Enriqueta",
          "lastName": "Blything",
          "birthdate": "1999-02-26T00:00:00",
          "address": "89 Sullivan Way",
          "gender": "Female",
          "bloodTypeId": 6,
          "patientTypeId": 5,
          "createdAt": "2023-09-28T00:00:00",
          "updatedAt": null
     },
     {
          "id": 92,
          "name": "Rhona",
          "lastName": "Van der Daal",
          "birthdate": "1998-05-31T00:00:00",
          "address": "1 Hanson Hill",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 7,
          "createdAt": "2016-05-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 93,
          "name": "Lenka",
          "lastName": "Novic",
          "birthdate": "2011-12-20T00:00:00",
          "address": "5905 Katie Center",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 3,
          "createdAt": "2018-07-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 94,
          "name": "Myriam",
          "lastName": "Marl",
          "birthdate": "1994-01-30T00:00:00",
          "address": "7 Lindbergh Road",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 8,
          "createdAt": "2022-02-27T00:00:00",
          "updatedAt": null
     },
     {
          "id": 95,
          "name": "Nathanil",
          "lastName": "Cant",
          "birthdate": "2011-06-02T00:00:00",
          "address": "8 Monument Parkway",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 1,
          "createdAt": "2016-08-16T00:00:00",
          "updatedAt": null
     },
     {
          "id": 96,
          "name": "Frasco",
          "lastName": "Dudley",
          "birthdate": "2005-12-02T00:00:00",
          "address": "9 Jana Street",
          "gender": "Male",
          "bloodTypeId": 2,
          "patientTypeId": 1,
          "createdAt": "2015-10-06T00:00:00",
          "updatedAt": null
     },
     {
          "id": 97,
          "name": "Eadie",
          "lastName": "Dumsday",
          "birthdate": "2015-03-27T00:00:00",
          "address": "7 Schlimgen Terrace",
          "gender": "Female",
          "bloodTypeId": 1,
          "patientTypeId": 6,
          "createdAt": "2024-01-14T00:00:00",
          "updatedAt": null
     },
     {
          "id": 98,
          "name": "Antonia",
          "lastName": "Rigardeau",
          "birthdate": "2020-01-20T00:00:00",
          "address": "4 Oakridge Court",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 4,
          "createdAt": "2020-01-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 99,
          "name": "Murry",
          "lastName": "Kubica",
          "birthdate": "2004-12-12T00:00:00",
          "address": "55 Hintze Drive",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 4,
          "createdAt": "2022-08-06T00:00:00",
          "updatedAt": null
     },
     {
          "id": 100,
          "name": "Aarika",
          "lastName": "Franck",
          "birthdate": "2008-11-19T00:00:00",
          "address": "1372 Atwood Terrace",
          "gender": "Female",
          "bloodTypeId": 2,
          "patientTypeId": 4,
          "createdAt": "2017-11-05T00:00:00",
          "updatedAt": null
     },
     {
          "id": 101,
          "name": "Trev",
          "lastName": "Devote",
          "birthdate": "2003-08-23T00:00:00",
          "address": "0 Southridge Center",
          "gender": "Male",
          "bloodTypeId": 1,
          "patientTypeId": 6,
          "createdAt": "2016-09-03T00:00:00",
          "updatedAt": null
     },
     {
          "id": 102,
          "name": "Emanuel",
          "lastName": "Raleston",
          "birthdate": "1997-07-12T00:00:00",
          "address": "18 Green Circle",
          "gender": "Male",
          "bloodTypeId": 2,
          "patientTypeId": 5,
          "createdAt": "2015-11-15T00:00:00",
          "updatedAt": null
     },
     {
          "id": 103,
          "name": "Thacher",
          "lastName": "Flacke",
          "birthdate": "2007-06-07T00:00:00",
          "address": "3 Shelley Center",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 6,
          "createdAt": "2015-10-26T00:00:00",
          "updatedAt": null
     },
     {
          "id": 104,
          "name": "Wanids",
          "lastName": "Deplacido",
          "birthdate": "1995-05-27T00:00:00",
          "address": "90 4th Crossing",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 5,
          "createdAt": "2018-02-23T00:00:00",
          "updatedAt": null
     },
     {
          "id": 105,
          "name": "Costanza",
          "lastName": "Scarlon",
          "birthdate": "1992-08-13T00:00:00",
          "address": "313 Tony Alley",
          "gender": "Female",
          "bloodTypeId": 7,
          "patientTypeId": 1,
          "createdAt": "2023-10-11T00:00:00",
          "updatedAt": null
     },
     {
          "id": 106,
          "name": "Huntington",
          "lastName": "Ciccotto",
          "birthdate": "2012-03-10T00:00:00",
          "address": "1 Sunfield Hill",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 2,
          "createdAt": "2019-11-01T00:00:00",
          "updatedAt": null
     },
     {
          "id": 107,
          "name": "Patricia",
          "lastName": "Ionnisian",
          "birthdate": "2005-08-10T00:00:00",
          "address": "45150 Johnson Alley",
          "gender": "Female",
          "bloodTypeId": 8,
          "patientTypeId": 2,
          "createdAt": "2017-02-14T00:00:00",
          "updatedAt": null
     },
     {
          "id": 108,
          "name": "Jarret",
          "lastName": "Simic",
          "birthdate": "2002-05-21T00:00:00",
          "address": "437 Kenwood Terrace",
          "gender": "Male",
          "bloodTypeId": 8,
          "patientTypeId": 8,
          "createdAt": "2019-01-22T00:00:00",
          "updatedAt": null
     },
     {
          "id": 109,
          "name": "Vladamir",
          "lastName": "Galea",
          "birthdate": "2011-10-04T00:00:00",
          "address": "1167 Parkside Way",
          "gender": "Male",
          "bloodTypeId": 5,
          "patientTypeId": 4,
          "createdAt": "2019-08-23T00:00:00",
          "updatedAt": null
     },
     {
          "id": 110,
          "name": "Earle",
          "lastName": "Iles",
          "birthdate": "1996-11-06T00:00:00",
          "address": "5548 Westend Way",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 7,
          "createdAt": "2018-10-15T00:00:00",
          "updatedAt": null
     },
     {
          "id": 111,
          "name": "Bradford",
          "lastName": "Gontier",
          "birthdate": "2003-10-29T00:00:00",
          "address": "3092 Brown Point",
          "gender": "Male",
          "bloodTypeId": 8,
          "patientTypeId": 3,
          "createdAt": "2018-06-29T00:00:00",
          "updatedAt": null
     },
     {
          "id": 112,
          "name": "Whitney",
          "lastName": "Brunskill",
          "birthdate": "2007-05-10T00:00:00",
          "address": "703 Clove Junction",
          "gender": "Male",
          "bloodTypeId": 6,
          "patientTypeId": 2,
          "createdAt": "2024-03-26T00:00:00",
          "updatedAt": null
     }
]

let selected = ref(people.find(p => p.id === props.currentSelected) || null)
let query = ref('')

function onSelect(newVal) {
     selected.value = newVal
     emit('update:currentSelected', newVal.id)
}

function displayText(person) {
     if (!person) return 'Seleccione al paciente'
     return `${person.name} ${person.lastName} (${person.gender})`
}

let filteredPeople = computed(() =>
     query.value === ''
          ? people
          : people.filter((person) =>
               person.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.value.toLowerCase().replace(/\s+/g, ''))
          )
)
</script>
