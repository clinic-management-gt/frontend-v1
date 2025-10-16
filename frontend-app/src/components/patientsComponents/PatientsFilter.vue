<template>
  <Disclosure as="section" aria-labelledby="filter-heading" class="grid items-center border-b border-gray-200">
    <h2 id="filter-heading" class="sr-only">Filters</h2>
    <div class="relative col-start-1 row-start-1 py-4">
      <div class="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
        <div class="pr-6">
          <DisclosureButton class="group flex items-center font-medium text-gray-700">
            <FunnelIcon class="mr-2 size-5 flex-none text-primary-color group-hover:text-primary-color-variation-1" aria-hidden="true" />
            {{ filterCount + ' ' + $t('general.filters') }}
          </DisclosureButton>
        </div>
        <div class="pl-6">
          <button type="button" class="text-gray-500" @click="clearSearchCriteria()">
            {{ $t('general.clear-all') }}
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="border-t border-gray-200 py-6">
      <form>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <!-- Nombre + Apellido -->
          <div class="flex flex-col">
            <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{ $t('general.full-name') }}</p>
            <SearchOption
              v-model="searchCriteria.fullName"
              :cleanText="clearText"
              icon="MagnifyingGlassIcon"
              textPlaceholder="general.full-name"
            />
          </div>

          <!-- Edad -->
          <div class="flex flex-col">
            <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{ $t('general.age') }}</p>
            <SearchOption
              v-model="searchCriteria.age"
              :cleanText="clearText"
              icon="MagnifyingGlassIcon"
              textPlaceholder="general.age"
            />
          </div>

          <!-- Contactos -->
          <div class="flex flex-col">
            <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{ $t('patients.contacts') }}</p>
            <SearchOption
              v-model="searchCriteria.contacts"
              :cleanText="clearText"
              icon="MagnifyingGlassIcon"
              textPlaceholder="patients.contacts"
            />
          </div>

          <!-- Última visita -->
          <div class="flex flex-col">
            <p class="mb-2 text-gray-600 block text-sm font-medium leading-6 truncate">{{ $t('patients.last-visit') }}</p>
            <SearchOption
              v-model="searchCriteria.lastVisit"
              :cleanText="clearText"
              icon="MagnifyingGlassIcon"
              textPlaceholder="patients.last-visit"
            />
          </div>
        </div>
      </form>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { FunnelIcon } from '@heroicons/vue/20/solid';
import { reactive, watchEffect, ref, nextTick, computed } from 'vue';
import { formatAgeFromDate } from '@utils/formatAge.js';
import SearchOption from '@/components/forms/SearchOption.vue';

const emit = defineEmits(['FilteredData']);
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const searchCriteria = reactive({
  fullName: '',
  age: '',
  contacts: '',
  lastVisit: ''
});

const filteredItems = ref([]);
const clearText = ref(false);

const clearSearchCriteria = () => {
  clearText.value = true;
  Object.keys(searchCriteria).forEach(key => {
    searchCriteria[key] = '';
  });
  nextTick(() => {
    clearText.value = false;
  });
};

const filterCount = computed(() => {
  return Object.values(searchCriteria).filter(value => value !== '' && value !== null).length;
});

const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

const getContactNames = (contact) => {
  if (!contact) return '';

  if (Array.isArray(contact)) {
    return contact
      .map(c => `${c.name || ''} ${c.lastName || ''} ${c.relationship || ''}`)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  return `${contact.name || ''} ${contact.lastName || ''} ${contact.relationship || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

watchEffect(() => {
  filteredItems.value = props.data.filter(item => {
    const fullName = normalizeText(`${item.name ?? ''} ${item.lastName ?? ''}`);
    const inputName = normalizeText(searchCriteria.fullName);
    const nameMatch = !inputName || fullName.includes(inputName);

    const ageMatch = !searchCriteria.age || Number(searchCriteria.age) === formatAgeFromDate(item.birthdate, 'number');

    const contactData = item.contact || item.contacts || item.parents;
    const contactNames = getContactNames(contactData);
    const inputContact = normalizeText(searchCriteria.contacts);
    const contactsMatch = !inputContact || contactNames.includes(inputContact);

    const lastVisitNormalized = normalizeText(item.lastVisit || '');
    const inputLastVisit = normalizeText(searchCriteria.lastVisit);
    const lastVisitMatch = !inputLastVisit || lastVisitNormalized.includes(inputLastVisit);

    return nameMatch && ageMatch && contactsMatch && lastVisitMatch;
  });

  emit('FilteredData', filteredItems.value);
});
</script>
