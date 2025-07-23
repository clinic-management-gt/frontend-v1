<template>
     <div>
          <p class="text-2xl">{{ $t('patients.patient-history') }}</p>

          <div
               v-for="item in paginatedData"
               :key="item.id"
               class="mb-2 cursor-pointer"
               @click="$emit('ver-receta', item)"
               >
               <div class="bg-gray-100 hover:bg-gray-300 rounded-md transition-colors duration-200">
                    <div class="flex justify-between items-center my-2 m-2">
                         <p class="text-xl">{{ isoFormatDate(item.createdAt).longSpanishDate }}</p>
                         <div class="flex">
                              <action-button-solid-icon icon="EyeIcon" size="h-10 w-10" color="text-patient-page-color" />
                              <action-button-solid-icon icon="PencilIcon" size="h-10 w-10" color="text-patient-page-color" />
                              <action-button-solid-icon icon="ArrowDownTrayIcon" size="h-10 w-10" color="text-patient-page-color" />
                         </div>
                    </div>
               </div>
          </div>

          <!-- Botones de navegación -->
          <div class="flex justify-between items-center mt-4">
               <action-button-solid-icon @click="prevPage" :disabled="currentPage === 1" icon="ChevronLeftIcon"
                    size="h-8 w-8" color="text-patient-page-color" />
               {{ currentPage }} - {{ totalPages }}
               <action-button-solid-icon @click="nextPage" :disabled="currentPage === totalPages"
                    icon="ChevronRightIcon" size="h-8 w-8" color="text-patient-page-color" />
          </div>
     </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { isoFormatDate } from '@utils/isoFormatDate';
import ActionButtonSolidIcon from '@components/forms/ActionButtonSolidIcon.vue';

const props = defineProps({
     data: {
          type: Array,
          default: () => []
     }
});

// Aplana tratamientos y recetas
const flatRecipes = computed(() => {
     return props.data.flatMap(treatment =>
          (treatment.recipes || []).map(recipe => ({
               ...recipe,
               treatmentId: treatment.treatmentId,
               appointmentId: treatment.appointmentId,
               medicineId: treatment.medicineId,
               dosis: treatment.dosis,
               duration: treatment.duration,
               frequency: treatment.frequency,
               observaciones: treatment.observaciones,
               status: treatment.status,
               createdAt: recipe.createdAt // para orden y formato
          }))
     );
});

const itemsPerPage = ref(5);
const currentPage = ref(1);

const orderedData = computed(() => {
     return [...flatRecipes.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const totalPages = computed(() => {
     return Math.ceil(orderedData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
     const start = (currentPage.value - 1) * itemsPerPage.value;
     return orderedData.value.slice(start, start + itemsPerPage.value);
});

const nextPage = () => {
     if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
     if (currentPage.value > 1) currentPage.value--;
};
</script>