<template>
     <div>
          <div v-if="isLoadingPatientData" class="text-center py-6">
               Cargando datos del paciente...
          </div>
          <div v-else class="px-6 py-8 mx-auto grid grid-cols-5 grid-rows-5 gap-5">
               <div class="col-span-5 bg-gray-100 rounded-xl">
                    <simple-patient-main-data-box :data="patientData" />
               </div>
               <div class="col-span-2 row-span-2 row-start-2 bg-gray-100 rounded-xl">
                    <simple-patient-info-box :data="medicalInfo" />
               </div>
               <div class="col-span-2 row-span-2 col-start-1 row-start-4 bg-gray-100 rounded-xl">
                    <simple-patient-contact-data-box :data="currentPatientSelectedData" />
               </div>
               <div class="col-span-3 col-start-3 row-start-2 bg-gray-100 rounded-xl">
                    <patient-data-sheet-box :data="patientData" />
               </div>
               <div class="col-span-3 row-span-3 col-start-3 row-start-3 rounded-xl">
                    <simple-history-log-box :data="historyLogData"/>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { usePatientsStore } from "@stores/patientsStore";

// Importar todas las utilidades necesarias
import { isoFormatDate } from '@/utils/isoFormatDate';
import { formatAgeFromDate } from '@/utils/formatAge';
import { normalizeGender } from '@/utils/normalizeGender';

// Importación del nuevo componente SimplePatientMainDataBox
import SimplePatientMainDataBox from "@components/patientsComponents/SimplePatientMainDataBox.vue";
import SimplePatientContactDataBox from "@components/patientsComponents/SimplePatientContactDataBox.vue";
import PatientDataSheetBox from "@components/patientsComponents/PatientDataSheetBox.vue";
import SimplePatientInfoBox from "@components/patientsComponents/SimplePatientInfoBox.vue";
import SimpleHistoryLogBox from "../components/patientsComponents/SimpleHistoryLogBox.vue";

// Store y referencias
const patientsStore = usePatientsStore();
const { 
     currentPatientSelectedId,
     currentPatientSelectedData,
     currentPatientMedicalRecords,
     isLoadingPatientData 
} = storeToRefs(patientsStore);

// Función segura para formatear fechas
const formatSafeDate = (dateString) => {
     if (!dateString) return 'No disponible';
     try {
          const date = new Date(dateString);
          return date.toLocaleDateString('es-ES', {
               year: 'numeric',
               month: 'long',
               day: 'numeric'
          });
     } catch (e) {
          console.error('Error al formatear fecha:', e);
          return 'Fecha inválida';
     }
};

// Función robusta para calcular edad
const calculateAge = (birthdate) => {
     console.log('calculateAge recibió:', birthdate);
     if (!birthdate) {
          console.log('No hay fecha de nacimiento');
          return 'No disponible';
     }
     
     try {
          // Convertir a objeto Date si es string
          const birth = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
          console.log('Fecha convertida a objeto Date:', birth);
          
          // Verificar si es una fecha válida
          if (isNaN(birth.getTime())) {
               console.log('Fecha inválida');
               return 'No disponible';
          }
          
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          console.log('Diferencia en años:', age);
          
          // Ajustar si aún no ha sido el cumpleaños este año
          if (
               today.getMonth() < birth.getMonth() || 
               (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
          ) {
               age--;
               console.log('Ajuste por cumpleaños no ocurrido aún:', age);
          }
          
          // Formatear la edad en años y meses
          if (age >= 0) {
               // Calcular meses adicionales
               let months = today.getMonth() - birth.getMonth();
               if (months < 0) {
                    months += 12;
               }
               if (today.getDate() < birth.getDate()) {
                    months--;
                    if (months < 0) months = 11;
               }
               console.log('Meses adicionales:', months);
               
               if (age === 0) {
                    return `${months} meses`;
               } else if (months === 0) {
                    return `${age} años`;
               } else {
                    return `${age} años y ${months} meses`;
               }
          }
          console.log('Edad no calculable');
          return 'No disponible';
     } catch (e) {
          console.error('Error al calcular edad:', e);
          return 'No disponible';
     }
};

// Datos computados del paciente con formato mejorado
const patientData = computed(() => {
     const birthdate = currentPatientSelectedData.value?.birthdate;
     console.log('Datos del paciente:', currentPatientSelectedData.value);
     console.log('Fecha de nacimiento original:', birthdate);
     let age;
     
     // Intentar usar la función existente, y si falla usar nuestra implementación
     try {
          age = formatAgeFromDate ? formatAgeFromDate(birthdate, 'string') : null;
          console.log('Edad calculada por formatAgeFromDate:', age);
          if (!age) {
               age = calculateAge(birthdate);
               console.log('Edad calculada por nuestra función:', age);
          }
     } catch (e) {
          console.warn('Error con formatAgeFromDate:', e);
          age = calculateAge(birthdate);
          console.log('Edad calculada en catch:', age);
     }

     // Normalización directa del género
     let gender = 'No especificado';
     if (currentPatientSelectedData.value?.gender) {
          const rawGender = currentPatientSelectedData.value.gender.toLowerCase();
          if (rawGender.includes('female')) {
               gender = 'Femenino';
          } else if (rawGender.includes('male')) {
               gender = 'Masculino';
          }
     }
     
     return {
          name: currentPatientSelectedData.value?.name || "Sin selección",
          lastName: currentPatientSelectedData.value?.lastName || "",
          birthdate: formatSafeDate(birthdate),
          age: age || "No disponible",
          gender: gender
     }
});

// Datos para historial con fallback a datos de ejemplo
const historyLogData = computed(() => {
     if (currentPatientMedicalRecords.value?.length) {
          // Transformar cada registro para asegurar que tenga los campos esperados
          return currentPatientMedicalRecords.value.map(record => {
               // Crear objeto con formato compatible
               const date = record.createdAt ? new Date(record.createdAt) : new Date();
               return {
                    id: record.id || 0,
                    date: date.toISOString(),
                    longSpanishDate: formatSafeDate(record.createdAt),
                    type: "Consulta Médica",
                    weight: record.weight ? `${record.weight} kg` : 'No registrado',
                    height: record.height ? `${record.height} m` : 'No registrado',
                    notes: record.notes || 'Sin notas',
                    familyHistory: record.familyHistory || 'Sin antecedentes registrados'
               };
          });
     }
    
    // Datos de ejemplo cuando no hay registros médicos
     return [
          { 
               id: 1, 
               date: new Date().toISOString(),
               longSpanishDate: formatSafeDate(new Date().toISOString()),
               type: "Consulta", 
               notes: "Sin registros médicos disponibles",
               weight: "No registrado",
               height: "No registrado",
               familyHistory: "Sin antecedentes registrados"
          }
     ];
});

// Datos computados médicos con formato mejorado
const medicalInfo = computed(() => {
     const lastRecord = currentPatientMedicalRecords.value?.[0];
     const birthdate = currentPatientSelectedData.value?.birthdate;
     let age;
     
     // Intentar usar la función existente, y si falla usar nuestra implementación
     try {
          age = formatAgeFromDate ? formatAgeFromDate(birthdate, 'string') : null;
          console.log('Edad médica calculada por formatAgeFromDate:', age);
          if (!age) {
               age = calculateAge(birthdate);
               console.log('Edad médica calculada por nuestra función:', age);
          }
     } catch (e) {
          console.warn('Error con formatAgeFromDate en medicalInfo:', e);
          age = calculateAge(birthdate);
          console.log('Edad médica calculada en catch:', age);
     }
     
     return {
          lastVisit: lastRecord?.createdAt ? formatSafeDate(lastRecord.createdAt) : 'Sin visitas previas',
          birthdate: formatSafeDate(birthdate),
          age: age || 'No disponible',
          alergies: currentPatientSelectedData.value?.alergies || [],
          syndrome: currentPatientSelectedData.value?.syndrome || []
     }
});

// Logs después de definir las variables computadas
console.log('patientData enviado al componente:', JSON.stringify(patientData.value));
console.log('medicalInfo enviado al componente:', JSON.stringify(medicalInfo.value));

// Observador para cargar datos cuando cambie el ID
watch(currentPatientSelectedId, async (newId) => {
     if (newId) {
          try {
               // Primero intentamos cargar datos básicos del paciente
               await patientsStore.fetchPatientData(newId);
               
               // Luego intentamos cargar registros médicos, pero manejamos el error
               try {
                    await patientsStore.fetchPatientMedicalRecords(newId);
               } catch (medicalError) {
                    console.warn('No se pudieron cargar registros médicos:', medicalError);
                    // No hacemos fallar toda la operación por esto
               }
               
          } catch (error) {
               console.error('Error al cargar datos del paciente:', error);
          }
     }
});

// Cargar datos del paciente seleccionado al montar el componente
onMounted(async () => {
     // Si ya hay un ID seleccionado, cargar sus datos
     if (currentPatientSelectedId.value) {
     console.log('Componente montado con ID seleccionado:', currentPatientSelectedId.value);
     try {
          // Cargar datos básicos del paciente
          await patientsStore.fetchPatientData(currentPatientSelectedId.value);
          
          // Intentar cargar registros médicos
          try {
          await patientsStore.fetchPatientMedicalRecords(currentPatientSelectedId.value);
          } catch (medicalError) {
          console.warn('No se pudieron cargar registros médicos:', medicalError);
          }
     } catch (error) {
          console.error('Error al cargar datos del paciente:', error);
     }
     }
});
</script>