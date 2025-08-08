<template>
  <!-- DEBUG (puedes quitar esto después) -->
  <div v-if="isOpen" class="fixed top-20 right-4 bg-green-500 text-white p-2 rounded z-[70] text-xs">
    🟢 MedicalRecordFormModal isOpen: {{ isOpen }}
  </div>
  
  <general-dialog-modal
    :is-open="isOpen"
    :title="isEditing ? 'Editar registro médico' : 'Agregar registro médico'"
    :show-confirm="false"
    custom-width="max-w-4xl"
    @close="handleClose"
  >
    <div class="space-y-6 max-h-[70vh] overflow-y-auto">
      <!-- Formulario principal -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Información básica -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Información básica</h3>
          
          <!-- Peso y Altura -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                v-model.number="formData.weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
              <input
                v-model.number="formData.height"
                type="number"
                step="0.1"
                placeholder="175.2"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Diagnóstico -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <input
              v-model="formData.diagnosis"
              type="text"
              placeholder="Diagnóstico del paciente..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Antecedentes familiares -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Antecedentes familiares</label>
            <textarea
              v-model="formData.familyHistory"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Antecedentes familiares del paciente..."
            ></textarea>
          </div>

          <!-- Notas de evolución -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas de evolución</label>
            <textarea
              v-model="formData.notes"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="Notas de evolución del paciente..."
            ></textarea>
          </div>
        </div>

        <!-- Receta médica -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">💊 Receta médica</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prescripción</label>
            <textarea
              v-model="formData.prescription"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
              rows="6"
              placeholder="Escriba la prescripción médica aquí...

Ejemplo:
1. Paracetamol 500mg - Tomar 1 cada 8 horas por 3 días
2. Ibuprofeno 400mg - Tomar 1 cada 12 horas si hay dolor
3. Descanso por 2 días"
            ></textarea>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 pt-4 border-t bg-white sticky bottom-0">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              {{ isEditing ? 'Actualizar registro' : 'Guardar registro' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </general-dialog-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  record: { type: Object, default: null },
  patientId: { type: [String, Number], required: true },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'save'])

const isLoading = ref(false)

// Formulario unificado
const formData = ref({
  // Medical Record fields
  weight: null,
  height: null,
  diagnosis:'',
  familyHistory: '',
  notes: '',
  // Recipe fields
  prescription: '',
  // Para futuro - Exams
  exams: []
})

// Lógica de envío unificada
async function handleSubmit() {
  console.log('📋 Enviando consulta médica completa:', formData.value)
  
  isLoading.value = true
  
  try {
    const results = {
      medicalRecord: null,
      recipe: null
    }
    
    // 1. Guardar/actualizar Medical Record si hay datos
    if (hasMedicalRecordData()) {
      const medicalRecordData = {
        weight: formData.value.weight || null,
        height: formData.value.height || null,
        familyHistory: formData.value.familyHistory || '',
        notes: formData.value.notes || ''
      }
      
      if (props.isEditing && props.record?.id) {
        console.log('✏️ Actualizando medical record...')
        results.medicalRecord = await updateMedicalRecord(props.record.id, medicalRecordData)
      } else {
        console.log('➕ Creando medical record...')
        results.medicalRecord = await createMedicalRecord(medicalRecordData)
      }
    }
    
    // 2. Manejar Recipe si hay prescripción
    if (formData.value.prescription?.trim()) {
      console.log('💊 Procesando receta médica...')
      
      // Buscar si ya existe una receta asociada al medical record
      const existingRecipe = await findExistingRecipe()
      
      if (existingRecipe && props.isEditing) {
        console.log('✏️ Actualizando receta existente...')
        results.recipe = await updateRecipe(existingRecipe.id, {
          prescription: formData.value.prescription
        })
      } else {
        console.log('➕ Creando nueva receta...')
        // Necesitamos crear un treatment básico primero
        const treatment = await createBasicTreatment()
        results.recipe = await createRecipe({
          treatmentId: treatment.id,
          prescription: formData.value.prescription
        })
      }
    }
    
    console.log('✅ Consulta médica guardada exitosamente:', results)
    
    emit('save', results)
    
  } catch (error) {
    console.error('❌ Error al guardar consulta médica:', error)
    alert('Error al guardar la consulta médica: ' + (error.message || 'Error desconocido'))
  } finally {
    isLoading.value = false
  }
}

// Helper functions
function hasMedicalRecordData() {
  return formData.value.weight || 
         formData.value.height || 
         formData.value.familyHistory?.trim() || 
         formData.value.notes?.trim()
}

async function createMedicalRecord(data) {
  // Mapear los campos al modelo EntityFramework correcto
  const medicalRecordData = {
    PatientId: parseInt(props.patientId),
    Weight: data.weight ? parseFloat(data.weight) : null,
    Height: data.height ? parseFloat(data.height) : null,
    FamilyHistory: data.familyHistory || null,
    Notes: data.notes || null
  }
  
  console.log('📤 Datos enviados al backend:', JSON.stringify(medicalRecordData, null, 2))
  // ⭐ Cambiar la URL para usar MedicalRecordsController
  console.log('📍 URL:', `${import.meta.env.VITE_API_URL}/medicalrecords`)
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/medicalrecords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicalRecordData)
  })
  
  console.log('📥 Respuesta del servidor:', response.status, response.statusText)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Error del servidor:', errorText)
    throw new Error(`Error ${response.status}: ${errorText}`)
  }
  
  const result = await response.json()
  console.log('✅ Medical Record creado exitosamente:', result)
  return result
}


async function updateMedicalRecord(recordId, data) {
  const medicalRecordData = {
    Weight: data.weight ? parseFloat(data.weight) : null,
    Height: data.height ? parseFloat(data.height) : null,
    FamilyHistory: data.familyHistory || null,
    Notes: data.notes || null
  }
  
  console.log('📤 Datos para actualización:', JSON.stringify(medicalRecordData, null, 2))
  // ⭐ Usar MedicalRecordsController para updates también
  console.log('📍 URL:', `${import.meta.env.VITE_API_URL}/medicalrecords/${recordId}`)
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/medicalrecords/${recordId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicalRecordData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Error del servidor:', errorText)
    throw new Error(`Error ${response.status}: ${errorText}`)
  }
  
  return await response.json()
}

async function createBasicTreatment() {
  // Crear una cita básica primero (si no existe)
  const appointmentResponse = await fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: props.patientId,
      appointmentDate: new Date().toISOString(),
      reason: 'Consulta médica - Registro completo',
      status: 'Completado'
    })
  })
  
  if (!appointmentResponse.ok) throw new Error('Error creando cita')
  const appointment = await appointmentResponse.json()
  
  // Crear treatment básico
  const treatmentResponse = await fetch(`${import.meta.env.VITE_API_URL}/treatments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appointmentId: appointment.id,
      dosis: 'Según prescripción',
      duration: 'Según prescripción',
      frequency: 'Según prescripción',
      observaciones: 'Generado desde consulta médica',
      status: 'Active'
    })
  })
  
  if (!treatmentResponse.ok) throw new Error('Error creando tratamiento')
  return await treatmentResponse.json()
}

async function createRecipe(data) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) throw new Error(`Error ${response.status}`)
  return await response.json()
}

async function updateRecipe(recipeId, data) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) throw new Error(`Error ${response.status}`)
  return await response.json()
}

// Cargar datos para edición
function loadRecordData(record) {
  if (record) {
    formData.value = {
      weight: record.weight || null,
      height: record.height || null,
      diagnosis: record.diagnosis|| '',
      familyHistory: record.familyHistory || '',
      notes: record.notes || '',
      prescription: '', // Lo cargaremos de las recetas asociadas
      exams: []
    }
    
    // Cargar receta asociada si existe
    if (record.recipes && record.recipes.length > 0) {
      formData.value.prescription = record.recipes[0].prescription || ''
    }
  } else {
    formData.value = {
      weight: null,
      height: null,
      diagnosis: '',
      familyHistory: '',
      notes: '',
      prescription: '',
      exams: []
    }
  }
}

function handleClose() {
  emit('close')
}

// Observar cambios en props
watch(() => [props.isOpen, props.record], ([isOpen, record]) => {
  if (isOpen) {
    loadRecordData(record)
  }
}, { immediate: true })
</script>