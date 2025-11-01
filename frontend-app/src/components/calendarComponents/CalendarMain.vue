<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import AppointmentModal from '@components/dashboardComponents/AppointmentModal.vue';
import ActionButtonOutlinedIcon from '@components/forms/ActionButtonOutlinedIcon.vue';
import GeneralDialogModal from '@components/forms/GeneralDialogModal.vue';
import PrimaryButton from '@components/forms/PrimaryButton.vue';
import ConfirmationModal from '@components/forms/ConfirmationModal.vue';
import CalendarDeleteEventModal from '@components/calendarComponents/CalendarDeleteEventModal.vue';
import { formatDateLong } from '@/utils/isoFormatDate';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAppointmentsStore } from '@/stores/appointmentsStore';
import { usePatientsStore } from '@/stores/patientsStore';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const showYearSelect = ref(false);
const selectedDayObj = ref(null);
const events = ref([]); // [{ day, month, year, patientName, drname, startTime, endTime, color, type, displayText }]

const notificationStore = useNotificationStore();
const appointmentsStore = useAppointmentsStore();
const patientsStore = usePatientsStore();

const { t } = useI18n();

const isAppointmentModalOpen = ref(false);
const preselectedDate = ref('');
const { selectedAppointment, showCalendarDeleteModal, eventToDelete, eventIndexToDelete } = storeToRefs(appointmentsStore);

/* Paciente */
const selectedPatient = ref('');
const patientStartTime = ref('');
const patientEndTime = ref('');
const patientColor = ref('#4caf50');

/* Actividad */
const activityText = ref('');
const activityStartTime = ref('');
const activityEndTime = ref('');
const activityColor = ref('#ff9800');

// Meses y días usando i18n
const months = computed(() => [
  t('calendar.january'),
  t('calendar.february'),
  t('calendar.march'),
  t('calendar.april'),
  t('calendar.may'),
  t('calendar.june'),
  t('calendar.july'),
  t('calendar.august'),
  t('calendar.september'),
  t('calendar.october'),
  t('calendar.november'),
  t('calendar.december')
]);

const days = computed(() => [
  t('calendar.sunday'),
  t('calendar.monday'),
  t('calendar.tuesday'),
  t('calendar.wednesday'),
  t('calendar.thursday'),
  t('calendar.friday'),
  t('calendar.saturday')
]);

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  selectedDayObj.value = null;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  selectedDayObj.value = null;
}

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());

const firstDayOfWeek = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

const prevMonthDays = computed(() => {
  const prevMonthLastDate = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const daysArr = [];
  for (let i = firstDayOfWeek.value - 1; i >= 0; i--) {
    daysArr.push({
      day: prevMonthLastDate - i,
      month: currentMonth.value === 0 ? 11 : currentMonth.value - 1,
      year: currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
      isOtherMonth: true
    });
  }
  return daysArr;
});

const nextMonthDays = computed(() => {
  const daysArr = [];
  const totalCells = prevMonthDays.value.length + daysInMonth.value;
  const nextDaysCount = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= nextDaysCount; i++) {
    daysArr.push({
      day: i,
      month: currentMonth.value === 11 ? 0 : currentMonth.value + 1,
      year: currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value,
      isOtherMonth: true
    });
  }
  return daysArr;
});

const calendarCells = computed(() => {
  const cells = [];
  const yT = today.getFullYear();
  const mT = today.getMonth();
  const dT = today.getDate();
 cells.push(...prevMonthDays.value);
  for (let d = 1; d <= daysInMonth.value; d++) {
    const isToday =
      d === dT &&
      currentMonth.value === mT &&
      currentYear.value === yT;

    cells.push({
      day: d,
      month: currentMonth.value,
      year: currentYear.value,
      isOtherMonth: false,
      isToday
    });
  }
  cells.push(...nextMonthDays.value.map(c => ({ ...c, isToday: false })));
  return cells;
});

const years = computed(() => {
  const arr = [];
  for (let y = currentYear.value - 10; y <= currentYear.value + 10; y++) arr.push(y);
  return arr;
});

function selectYear(year) {
  currentYear.value = year;
  showYearSelect.value = false;
  selectedDayObj.value = null;
}

function dayClicked(cell) {
  if (!cell || cell.isOtherMonth) return;
  selectedDayObj.value = { ...cell };
  selectedPatient.value = '';
  patientStartTime.value = '';
  patientEndTime.value = '';
  patientColor.value = '#4caf50';
  activityText.value = '';
  activityStartTime.value = '';
  activityEndTime.value = '';
  activityColor.value = '#ff9800';
}

function openAppointmentModalForDate(dayObj = today) {
  if (!dayObj || dayObj.isOtherMonth) return;
  const year = dayObj.year;
  const month = String(dayObj.month + 1).padStart(2, '0');
  const day = String(dayObj.day).padStart(2, '0');
  preselectedDate.value = `${year}-${month}-${day}`;
  isAppointmentModalOpen.value = true;
}

function closeAppointmentModal() {
  isAppointmentModalOpen.value = false;
  preselectedDate.value = '';
}

function onAppointmentCreated() {
  closeAppointmentModal();
  fetchAppointments();
}

// limitar eventos mostrados en la celda
function getLimitedEventsForDay(dayObj) {
  if (!dayObj) return { visibleEvents: [], remainingCount: 0 };
  const allEvents = events.value
    .filter((e) => e.day === dayObj.day && e.month === dayObj.month && e.year === dayObj.year)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  const maxVisible = 3;
  const visibleEvents = allEvents.slice(0, maxVisible);
  const remainingCount = Math.max(0, allEvents.length - maxVisible);
  return { visibleEvents, remainingCount };
}

function getEventsForDay(dayObj) {
  if (!dayObj) return [];
  const filteredEvents = events.value
    .filter((e) => e.day === dayObj.day && e.month === dayObj.month && e.year === dayObj.year)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  
  return filteredEvents.map((e) => ({
    day: e.day,
    month: e.month,
    year: e.year,
    patientName: e.patientName || e.text || '',
    startTime: e.startTime,
    endTime: e.endTime,
    drname: e.drname || '',
    color: e.color,
    type: e.type,
    displayText: e.displayText
  }));
}

/* --- Edición y Eliminación --- */
const editingIndex = ref(null);
const editingEventId = ref(null);

const dayEvents = computed(() => getEventsForDay(selectedDayObj.value));

function startEdit(i, event) {
  if (event.type === 'Cita') {
    openAppointmentEdit(event);
    return;
  }
  
  // Para otros eventos, abrir el modal de edición con datos prellenados
  editingIndex.value = i;
  editingEventId.value = events.value.findIndex((e) => e === dayEvents.value[i]);
  
  // Crear un appointment temporal para el modal
  editingAppointment.value = {
    id: editingEventId.value,
    patientName: event.patientName || '',
    date: `${event.year}-${String(event.month + 1).padStart(2, '0')}-${String(event.day).padStart(2, '0')}T${event.startTime}:00`,
    appointment_date: `${event.year}-${String(event.month + 1).padStart(2, '0')}-${String(event.day).padStart(2, '0')}T${event.startTime}:00`,
    status: 'Pendiente',
    notes: '',
    patientId: '',
    drname: event.drname || ''
  };
  
  openEditModal(editingAppointment.value);
}

function openCalendarDeleteModal(i, event) {
  const fullEvent = {
    ...event,
    patientData: {
      id: event.patientId || null,
      name: event.patientName || '',
      drname: event.drname || ''
    },
    day: event.day,
    month: event.month,
    year: event.year,
    startTime: event.startTime,
    endTime: event.endTime,
    type: event.type,
    color: event.color
  };
  
  appointmentsStore.openCalendarDeleteModal(i, fullEvent);
}

function closeCalendarDeleteModal() {
  appointmentsStore.closeCalendarDeleteModal();
}

async function confirmCalendarDelete() {
  if (eventIndexToDelete.value === null || !eventToDelete.value) {
    closeCalendarDeleteModal();
    return;
  }

  try {
    // Si es una cita del backend
    if (eventToDelete.value.type === 'Cita') {
      const appointment = appointmentsStore.appointments.find(
        (app) => app.patientName === eventToDelete.value.patientName
      );
      
      if (appointment && appointment.id) {
        await appointmentsStore.deleteAppointment(appointment.id);
        await fetchAppointments();
      }
    } else {
      // Es un evento local
      const realIndex = events.value.findIndex((e) => e === dayEvents.value[eventIndexToDelete.value]);
      if (realIndex !== -1) {
        events.value.splice(realIndex, 1);
        notificationStore.addNotification(
          'success',
          t('notifications.success'),
          t('calendar.event-deleted-success') || 'Evento eliminado exitosamente'
        );
      }
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    notificationStore.addNotification(
      'error',
      t('general.error'),
      t('calendar.error-deleting-event') || 'Error al eliminar el evento'
    );
  } finally {
    closeCalendarDeleteModal();
  }
}

function deleteEvent(i) {
  const eventData = dayEvents.value[i];
  openCalendarDeleteModal(i, eventData);
}

// Citas desde store
async function fetchAppointments() {
  try {
    const data = await appointmentsStore.fetchAppointments();
    events.value = events.value.filter((e) => e.type !== 'Cita');
    data.forEach((app) => {
      const date = new Date(app.date || app.appointment_date);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      events.value.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        patientId: app.patientId || app.patient_id || null,
        patientName: app.patientName || '',
        drname: app.drname || app.doctorName || '',
        displayText: timeStr,
        startTime: timeStr,
        endTime: app.endTime || null,
        color: app.color,
        type: 'Cita',
        text: app.patientName
      });
    });
  } catch {
    notificationStore.addNotification('error', t('general.error'), t('appointments.error-fetching-appointments'));
  }
}

// Scroll al panel de agenda
const refDaySelectedAgenda = ref(null);
watch(selectedDayObj, async (newVal) => {
  if (newVal) {
    await nextTick();
    setTimeout(() => {
      if (refDaySelectedAgenda.value) {
        refDaySelectedAgenda.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
});

// Modal de edición de citas
const showEditModal = ref(false);
const editingAppointment = ref(null);
const editForm = ref({ patientId: '', patientName: '', date: '', time: '', endTime: '', status: 'Pendiente', notes: '' });

// Pacientes
const patients = ref([]);
const filteredPatients = ref([]);
const searchPatient = ref('');

const appointmentStatuses = ['general.pending', 'general.confirmed', 'general.completed', 'general.canceled'];

async function fetchPatients() {
  try {
    const data = await patientsStore.fetchAllPatients();
    patients.value = data;
    filteredPatients.value = data;
  } catch {
    notificationStore.addNotification('error', t('general.error'), t('patients.error-fetching-patients'));
  }
}

const showPatientDropdown = ref(false);
function onSearchFocus() { if (!editingAppointment.value || !searchPatient.value) showPatientDropdown.value = true; }
function onSearchBlur() { setTimeout(() => { showPatientDropdown.value = false; }, 200); }
function selectPatient(patient) {
  editForm.value.patientId = patient.id;
  editForm.value.patientName = patient.name;
  searchPatient.value = patient.name;
  showPatientDropdown.value = false;
}
function filterPatients() {
  if (!searchPatient.value || searchPatient.value.length < 2) { filteredPatients.value = []; return; }
  filteredPatients.value = patients.value.filter((p) => p.name.toLowerCase().includes(searchPatient.value.toLowerCase()) || p.email.toLowerCase().includes(searchPatient.value.toLowerCase()));
}

function openEditModal(appointment) {
  editingAppointment.value = appointment;
  const date = new Date(appointment.date || appointment.appointment_date);
  editForm.value = {
    patientId: appointment.patientId || '',
    patientName: appointment.patientName || '',
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().substring(0, 5),
    endTime: appointment.endTime || '',
    status: appointment.status || 'Pendiente',
    notes: appointment.notes || ''
  };
  searchPatient.value = editForm.value.patientName;
  showEditModal.value = true;
}

async function saveAppointment() {
  try {
    const appointmentData = { 
      patientId: editForm.value.patientId, 
      date: `${editForm.value.date}T${editForm.value.time}:00`, 
      status: editForm.value.status, 
      notes: editForm.value.notes 
    };
    
    // Si es una cita real del store (tiene ID válido del backend)
    if (editingAppointment.value.id && typeof editingAppointment.value.id === 'string') {
      await appointmentsStore.updateAppointment(editingAppointment.value.id, appointmentData);
      await fetchAppointments();
    } else {
      // Es un evento local, actualizar directamente en el array
      const eventIndex = editingEventId.value;
      if (eventIndex !== null && eventIndex !== -1 && events.value[eventIndex]) {
        const event = events.value[eventIndex];
        const [datePart, timePart] = editForm.value.date.split('T');
        const [year, month, day] = datePart.split('-');
        
        event.patientName = editForm.value.patientName;
        event.text = editForm.value.patientName;
        event.day = parseInt(day);
        event.month = parseInt(month) - 1;
        event.year = parseInt(year);
        event.startTime = editForm.value.time;
        event.endTime = editForm.value.endTime || null;
      }
    }
    
    closeEditModal();
  } catch { /* manejado por store */ }
}

// Confirmación de eliminación
const showDeleteConfirmation = ref(false);
const appointmentToDelete = ref(null);

async function deleteAppointment() { 
  appointmentToDelete.value = { ...editingAppointment.value }; 
  showDeleteConfirmation.value = true; 
}

async function confirmDelete() {
  showDeleteConfirmation.value = false;
  try {
    const appointmentId = appointmentToDelete.value.id;
    
    // Si es una cita real del store (tiene ID válido del backend)
    if (appointmentId && typeof appointmentId === 'string') {
      await appointmentsStore.deleteAppointment(appointmentId);
      await fetchAppointments();
    } else {
      // Es un evento local, eliminar directamente del array
      const eventIndex = editingEventId.value;
      if (eventIndex !== null && eventIndex !== -1 && events.value[eventIndex]) {
        events.value.splice(eventIndex, 1);
      }
    }
    
    closeEditModal();
    appointmentToDelete.value = null;
  } finally {
    showDeleteConfirmation.value = false;
  }
}

function closeEditModal() {
  showEditModal.value = false;
  if (!showDeleteConfirmation.value) editingAppointment.value = null;
  editForm.value = { patientId: '', patientName: '', date: '', time: '', endTime: '', status: 'Pendiente', notes: '' };
  searchPatient.value = '';
  editingIndex.value = null;
  editingEventId.value = null;
}

function openAppointmentEdit(event) {
  if (event.type === 'Cita') {
    const appointment = appointmentsStore.appointments.find((app) => app.patientName === event.patientName);
    if (appointment) openEditModal(appointment);
  }
}

onMounted(() => { fetchAppointments(); fetchPatients(); });
</script>

<template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2 lg:flex-none" >
      <div class="relative flex items-center text-primary-color font-bold text-lg">
        <span>{{ months[currentMonth] }}</span>
        <button class="rounded-md px-2 py-1 hover:bg-primary-color-variation-2/20" @click="showYearSelect = !showYearSelect">{{ currentYear }}</button>
        <!-- Year select dropdown -->
        <div v-if="showYearSelect" class="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 max-h-60 overflow-auto">
          <div
            v-for="year in years"
            :key="year"
            class="px-3 py-2 cursor-pointer hover:bg-gray-50 text-primary-color-variation-1"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>  
      <div class="flex items-center items-middle">
        <action-button-outlined-icon
        icon="ChevronLeftIcon"
        size="h-10 w-10"
        @click="prevMonth"
        />
        <action-button-outlined-icon
        icon="ChevronRightIcon"
        size="h-10 w-10"
        @click="nextMonth"
        />
        <div class="ml-6 h-6 w-px bg-gray-300"></div>
        <primary-button class="ml-6" additionalCSS="justify-center shadow-sm" @click="openAppointmentModalForDate()">
          {{ t('calendar.schedule-appointment') }}
        </primary-button>
      </div>
    </div>

  <!-- Tabla del calendario -->
  <div class="shadow-sm rounded-lg ring-1 ring-black/5 overflow-hidden lg:flex lg:flex-auto lg:flex-col">
      <div class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold text-gray-700 lg:flex-none">
        <div v-for="day in days" :key="day" class="flex justify-center bg-white py-2">{{ day }}</div>
      </div>

      <div class="flex bg-gray-200 text-xs text-gray-700 lg:flex-none">
        <div class="w-full grid grid-cols-7 auto-rows-fr gap-px">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="`c-${cell.year}-${cell.month}-${cell.day}-${idx}`"
            class="group relative px-3 py-2 min-h-28 text-gray-900 hover:bg-gray-50"
            :class="[ cell.isOtherMonth ? 'bg-gray-100 text-black' : 'bg-white' ]"
            @click.stop="dayClicked(cell)"
          >
            <!-- Actividades -->
            <div class="flex items-center justify-between">
              <span
                class="relative inline-flex items-center justify-center h-6 w-6 rounded-full"
                :class="[
                  cell.isToday
                    ? 'bg-primary-color text-white font-semibold'
                    : (cell.isOtherMonth ? 'text-gray-400' : 'text-gray-900')
                ]"
              >
                {{ cell.day }}
              </span>
            </div>

            <!-- Eventos -->
            <div class="mt-2 flex flex-col gap-1">
              <div
                v-for="(event, i) in getLimitedEventsForDay(cell).visibleEvents"
                :key="`ev-${i}`"
                class="flex items-center justify-between rounded text-[11px] text-black"
              >
                <span class="flex-1 min-w-0 truncate" :title="event.patientName || event.text">{{ event.patientName || event.text }}</span>
                <span v-if="event.type !== 'Cita'" class="ml-2 flex-shrink-0 whitespace-nowrap font-semibold text-right">
                  {{ event.startTime }}<span v-if="event.endTime"> - {{ event.endTime }}</span>
                </span>
                <span v-else class="ml-2 flex-shrink-0 whitespace-nowrap font-semibold text-right">{{ event.displayText || event.startTime }}</span>
              </div>
              <button
                v-if="getLimitedEventsForDay(cell).remainingCount > 0"
                class="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 hover:bg-gray-100"
                @click.stop="dayClicked(cell)"
              >
                +{{ getLimitedEventsForDay(cell).remainingCount }} {{ t('general.more') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de actividades del día seleccionado -->
    <div
      v-if="selectedDayObj"
      ref="refDaySelectedAgenda"
      class="w-full mt-4"
    >
      <h3 class="mb-2 text-primary-color font-semibold">{{ t('calendar.agenda-for') || 'Agenda para el' }} {{ formatDateLong(`${selectedDayObj.year}-${selectedDayObj.month + 1}-${selectedDayObj.day}`)}}</h3>

      <ul class="divide-y divide-gray-200 space-y-2">
        <li
          v-for="(event, i) in getEventsForDay(selectedDayObj)"
          :key="i"
          class="flex items-center w-full"
        >
          <!-- Left: content grows -->
          <div class="flex-1 min-w-0 flex items-center gap-3">
            <div class="flex flex-col start">
              <p>
                <span class="inline-block h-3 w-3 mr-2 rounded-full flex-shrink-0" :style="{ background: '#40D7C3' }"></span>
                <span class="font-medium truncate" :title="event.patientName">{{ event.patientName }}</span>
              </p>
              <!-- <span v-if="event.drname" class="text-sm text-gray-600 truncate" :title="event.drname">{{ $t('general.doctor-abbreviation') }} {{ event.drname }}</span> -->
            </div>
            <span class="text-sm truncate">{{ $t('calendar.reason') + (event.reason ? event.reason : '') }}</span>
          </div>

          <!-- Right: time and actions (do not shrink) -->
          <div class="flex items-center gap-3 text-sm flex-shrink-0 ml-4">
            <span class="whitespace-nowrap">{{ event.startTime }}<template v-if="event.endTime"> - {{ event.endTime }}</template></span>
              <action-button-outlined-icon icon="PencilSquareIcon" size="h-5 w-5 text-primary-color" @click="startEdit(i, event)" />
              <action-button-outlined-icon icon="TrashIcon" size="h-5 w-5 text-rose-600" @click="deleteEvent(i)" />
          </div>
        </li>
        <li v-if="getEventsForDay(selectedDayObj).length === 0" class="text-sm text-gray-600">{{ t('calendar.no-events') }}</li>
      </ul>
    </div>
    <!-- Modal de edición de citas -->
    <general-dialog-modal
        :isOpen="showEditModal"
        dialogSize="max-w-2xl"
        :cancelButton="true"
        @close-modal="closeEditModal"
      >
      <template #title>
        <p class="text-xl font-semibold">{{ t('calendar.edit-appointment') }}</p>
      </template>

      <template #body>
        <form class="space-y-6" @submit.prevent="saveAppointment">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ t('calendar.patient') }}:</label>
            <div class="relative">
              <input
                v-model="searchPatient"
                :placeholder="t('calendar.search-patient-placeholder')"
                class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm"
                @input="filterPatients"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
              />
              <div v-if="showPatientDropdown && searchPatient && searchPatient.length > 2 && filteredPatients.length > 0 && (!editingAppointment || searchPatient !== editForm.patientName)" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <div
                  v-for="patient in filteredPatients.slice(0, 5)"
                  :key="patient.id"
                  class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-50"
                  @mousedown="selectPatient(patient)"
                >
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900">{{ patient.name }}</span>
                    <span class="text-sm text-gray-500">{{ patient.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ t('calendar.date') }}:</label>
            <input
              v-model="editForm.date"
              type="date"
              required
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ t('calendar.time') }}:</label>
            <input
              v-model="editForm.time"
              type="time"
              required
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ t('calendar.end-time') || 'Hora de fin' }}:</label>
            <input
              v-model="editForm.endTime"
              type="time"
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">{{ t('calendar.status') }}:</label>
            <select v-model="editForm.status" class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm">
              <option v-for="status in appointmentStatuses" :key="status" :value="status">{{ t(status) }}</option>
            </select>
          </div>
        </form>
      </template>

      <template #buttons>
        <div class="flex justify-between gap-3">
          <button
            type="button"
            class="rounded bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            @click="deleteAppointment"
          >
            {{ t('calendar.delete-appointment') }}
          </button>
          <div class="flex gap-3">
            <button
              type="button"
              class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              @click="closeEditModal"
            >
              {{ t('calendar.cancel') }}
            </button>
            <button
              type="button"
              class="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              @click="saveAppointment"
            >
              {{ t('calendar.save-changes') }}
            </button>
          </div>
        </div>
      </template>
    </general-dialog-modal>

    <!-- Modal de Agendamiento -->
    <AppointmentModal
      :isOpen="isAppointmentModalOpen"
      :preselectedDate="preselectedDate"
      @close="closeAppointmentModal"
      @appointment-created="onAppointmentCreated"
    />

    <!-- Modal de Confirmación para eliminar cita -->
    <ConfirmationModal
      :isOpen="showDeleteConfirmation"
      type="danger"
      :title="t('calendar.delete-appointment')"
      :message="t('calendar.delete-appointment-confirmation')"
      :confirmText="t('general.delete')"
      :cancelText="t('general.cancel')"
      @close="showDeleteConfirmation = false"
      @confirm="confirmDelete"
    />

    <!-- Modal de eliminación de eventos del calendario -->
    <CalendarDeleteEventModal
      :isOpen="showCalendarDeleteModal"
      :patientData="eventToDelete"
      @close="closeCalendarDeleteModal"
      @confirm="confirmCalendarDelete"
    />
  </div>
</template>
