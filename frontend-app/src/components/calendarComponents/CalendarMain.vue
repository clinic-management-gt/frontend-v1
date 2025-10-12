<script setup>
import styles from "./CalendarMain.module.css";
import { ref, watch, nextTick, computed } from "vue";
import { onMounted } from "vue";
import AppointmentModal from "@components/dashboardComponents/AppointmentModal.vue";
import GeneralDialogModal from "@components/forms/GeneralDialogModal.vue";
import ConfirmationModal from "@components/forms/ConfirmationModal.vue";
import { useNotificationStore } from "@/stores/notificationStore";
import { useI18n } from "vue-i18n";
import instance from "@stores/axios.js";

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const showYearSelect = ref(false);
const selectedDayObj = ref(null);
const events = ref([]); // [{ day, month, year, text, startTime, endTime, color, type }]

// Store de notificaciones
const notificationStore = useNotificationStore();

// Instancia de i18n
const { t } = useI18n();

// Estados para el modal de agendamiento
const isAppointmentModalOpen = ref(false);
const preselectedDate = ref("");

/* Paciente */
const selectedPatient = ref("");
const patientStartTime = ref("");
const patientEndTime = ref("");
const patientColor = ref("#4caf50");

/* Actividad */
const activityText = ref("");
const activityStartTime = ref("");
const activityEndTime = ref("");
const activityColor = ref("#ff9800");

// Meses y días usando i18n
const months = computed(() => [
  t("calendar.january"),
  t("calendar.february"),
  t("calendar.march"),
  t("calendar.april"),
  t("calendar.may"),
  t("calendar.june"),
  t("calendar.july"),
  t("calendar.august"),
  t("calendar.september"),
  t("calendar.october"),
  t("calendar.november"),
  t("calendar.december"),
]);

const days = computed(() => [
  t("calendar.sunday"),
  t("calendar.monday"),
  t("calendar.tuesday"),
  t("calendar.wednesday"),
  t("calendar.thursday"),
  t("calendar.friday"),
  t("calendar.saturday"),
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

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const prevMonthDays = computed(() => {
  const prevMonthLastDate = new Date(
    currentYear.value,
    currentMonth.value,
    0,
  ).getDate();
  const daysArr = [];
  for (let i = firstDayOfWeek.value - 1; i >= 0; i--) {
    daysArr.push({
      day: prevMonthLastDate - i,
      month: currentMonth.value === 0 ? 11 : currentMonth.value - 1,
      year:
        currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
      isOtherMonth: true,
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
      year:
        currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value,
      isOtherMonth: true,
    });
  }
  return daysArr;
});

const calendarCells = computed(() => {
  const cells = [];
  cells.push(...prevMonthDays.value);
  for (let d = 1; d <= daysInMonth.value; d++) {
    cells.push({
      day: d,
      month: currentMonth.value,
      year: currentYear.value,
      isOtherMonth: false,
    });
  }
  cells.push(...nextMonthDays.value);
  return cells;
});

const years = computed(() => {
  const arr = [];
  for (let y = currentYear.value - 5; y <= currentYear.value + 5; y++) {
    arr.push(y);
  }
  return arr;
});

const weeks = computed(() => {
  const cells = calendarCells.value;
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
});

function selectYear(year) {
  currentYear.value = year;
  showYearSelect.value = false;
  selectedDayObj.value = null;
}

function dayClicked(cell) {
  if (!cell || cell.isOtherMonth) return;
  selectedDayObj.value = { ...cell };
  selectedPatient.value = "";
  patientStartTime.value = "";
  patientEndTime.value = "";
  patientColor.value = "#4caf50";
  activityText.value = "";
  activityStartTime.value = "";
  activityEndTime.value = "";
  activityColor.value = "#ff9800";
  
  // Abrir modal de agendamiento con la fecha seleccionada
  openAppointmentModalForDate(cell);
}

/**
 * Abre el modal de agendamiento con la fecha del día seleccionado
 */
function openAppointmentModalForDate(dayObj) {
  if (!dayObj || dayObj.isOtherMonth) return;
  
  // Formatear la fecha para el input type="date" (YYYY-MM-DD)
  const year = dayObj.year;
  const month = String(dayObj.month + 1).padStart(2, '0'); // Los meses en JS son 0-indexados
  const day = String(dayObj.day).padStart(2, '0');
  
  // Asignar la fecha formateada
  preselectedDate.value = `${year}-${month}-${day}`;
  isAppointmentModalOpen.value = true;
}

/**
 * Cierra el modal de agendamiento
 */
function closeAppointmentModal() {
  isAppointmentModalOpen.value = false;
  preselectedDate.value = "";
}

/**
 * Maneja cuando se crea una nueva cita desde el calendario
 */
function onAppointmentCreated() {
  closeAppointmentModal();
  // Recargar las citas para mostrar la nueva en el calendario
  fetchAppointments();
}

/* --- Agregar Paciente o Actividad --- */
function addPatientEvent() {
  if (selectedPatient.value && patientStartTime.value && selectedDayObj.value) {
    events.value.push({
      day: selectedDayObj.value.day,
      month: selectedDayObj.value.month,
      year: selectedDayObj.value.year,
      text: selectedPatient.value,
      startTime: patientStartTime.value,
      endTime: patientEndTime.value || null,
      color: patientColor.value,
      type: "Paciente",
    });
    selectedPatient.value = "";
    patientStartTime.value = "";
    patientEndTime.value = "";
    patientColor.value = "#4caf50";
  }
}

function addActivityEvent() {
  if (activityText.value && activityStartTime.value && selectedDayObj.value) {
    events.value.push({
      day: selectedDayObj.value.day,
      month: selectedDayObj.value.month,
      year: selectedDayObj.value.year,
      text: activityText.value,
      startTime: activityStartTime.value,
      endTime: activityEndTime.value || null,
      color: activityColor.value,
      type: "Actividad",
    });
    activityText.value = "";
    activityStartTime.value = "";
    activityEndTime.value = "";
    activityColor.value = "#ff9800";
  }
}

//funcion para limitar eventos mostrados en el calendario

function getLimitedEventsForDay(dayObj) {
  if (!dayObj) return { visibleEvents: [], remainingCount: 0 };

  const allEvents = events.value
    .filter(
      (e) =>
        e.day === dayObj.day &&
        e.month === dayObj.month &&
        e.year === dayObj.year,
    )
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

  const maxVisible = 3;
  const visibleEvents = allEvents.slice(0, maxVisible);
  const remainingCount = Math.max(0, allEvents.length - maxVisible);

  return { visibleEvents, remainingCount };
}

function getEventsForDay(dayObj) {
  if (!dayObj) return [];
  return events.value
    .filter(
      (e) =>
        e.day === dayObj.day &&
        e.month === dayObj.month &&
        e.year === dayObj.year,
    )
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}

/* --- Edición y Eliminación --- */
const editingIndex = ref(null); // Índice en la lista visual
const editingEventId = ref(null); // Índice real en events.value
const editingText = ref("");
const editingStart = ref("");
const editingEnd = ref("");
const editingColor = ref("");

// Computado para acceder a los eventos del día actual fácilmente
const dayEvents = computed(() => getEventsForDay(selectedDayObj.value));

function startEdit(i, event) {
  editingIndex.value = i;
  editingText.value = event.text;
  editingStart.value = event.startTime;
  editingEnd.value = event.endTime || "";
  editingColor.value = event.color;
  // Índice real del evento en events.value
  editingEventId.value = events.value.findIndex(
    (e) => e === dayEvents.value[i],
  );
}

function saveEdit() {
  if (editingEventId.value === null || editingEventId.value === -1) return;
  if (editingText.value && editingStart.value) {
    const event = events.value[editingEventId.value];
    event.text = editingText.value;
    event.startTime = editingStart.value;
    event.endTime = editingEnd.value || null;
    event.color = editingColor.value;
    editingIndex.value = null;
    editingEventId.value = null;
  }
}

function cancelEdit() {
  editingIndex.value = null;
  editingEventId.value = null;
}

function deleteEvent(i) {
  const realIndex = events.value.findIndex((e) => e === dayEvents.value[i]);
  if (realIndex !== -1) events.value.splice(realIndex, 1);
  if (editingIndex.value === i) {
    editingIndex.value = null;
    editingEventId.value = null;
  }
}

const appointments = ref([]);

async function fetchAppointments() {
  try {
    const response = await instance.get('/appointments');
    const data = response.data;
    appointments.value = data;

    // Limpia eventos previos de tipo 'Cita'
    events.value = events.value.filter((e) => e.type !== "Cita");

    // Agrega las citas como eventos
    data.forEach((app) => {
      const date = new Date(app.date || app.appointment_date);
      const timeStr = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      // Usar solo la hora como texto visible en el calendario
      // Pero mantener la información completa para la edición
      events.value.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        text: `${app.PatientName || app.patientName}`,  // Guardamos nombre del paciente
        displayText: timeStr,  // Solo mostramos la hora en el calendario
        startTime: timeStr,
        endTime: null,
        color: getColorByStatus(app.Status || app.status),  // Color según estado
        type: "Cita",
      });
    });
  } catch (e) {
    console.error("Error al obtener citas:", e);
  }
}

//referencia al div del panel de la agenda
const refDaySelectedAgenda = ref(null);

watch(selectedDayObj, async (newVal) => {
  if (newVal) {
    await nextTick();
    //esperar que se cargue el componente
    setTimeout(() => {
      if (refDaySelectedAgenda.value) {
        refDaySelectedAgenda.value.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  }
});

// Estados para el modal de edición de citas
const showEditModal = ref(false);
const editingAppointment = ref(null);
const editForm = ref({
  patientId: "",
  patientName: "",
  date: "",
  time: "",
  status: "Pendiente",
  notes: "",
});

// Lista de pacientes para el dropdown
const patients = ref([]);
const filteredPatients = ref([]);
const searchPatient = ref("");

// Lista de estados disponibles
const appointmentStatuses = [
  "general.pending",
  "general.confirmed",
  "general.completed",
  "general.canceled",
];

// Nuevas funciones para manejar la edición
async function fetchPatients() {
  try {
    const response = await instance.get('/patients');
    const data = response.data;
    patients.value = data;
    filteredPatients.value = data;
  } catch (e) {
    console.error("Error al obtener pacientes:", e);
  }
}

const showPatientDropdown = ref(false);

function onSearchFocus() {
  // En modo edición, solo mostrar dropdown si no hay un paciente ya seleccionado
  // o si el campo está vacío
  if (!editingAppointment.value || !searchPatient.value) {
    showPatientDropdown.value = true;
  }
}

function onSearchBlur() {
  // Delay para permitir click en opciones
  setTimeout(() => {
    showPatientDropdown.value = false;
  }, 200);
}

function selectPatient(patient) {
  editForm.value.patientId = patient.id;
  editForm.value.patientName = patient.name;
  searchPatient.value = patient.name;
  showPatientDropdown.value = false;
}

function filterPatients() {
  if (!searchPatient.value || searchPatient.value.length < 2) {
    filteredPatients.value = [];
    return;
  }

  filteredPatients.value = patients.value.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchPatient.value.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchPatient.value.toLowerCase()),
  );
}

function openEditModal(appointment) {
  editingAppointment.value = appointment;

  // Llenar el formulario con los datos actuales
  const date = new Date(appointment.date || appointment.appointment_date);
  editForm.value = {
    patientId: appointment.PatientID || appointment.patientId || "",
    patientName: appointment.PatientName || appointment.patientName || "",
    date: date.toISOString().split("T")[0],
    time: date.toTimeString().substring(0, 5),
    status: appointment.Status || appointment.status || "Pendiente",
    notes: appointment.Notes || appointment.notes || "",
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
      notes: editForm.value.notes,
    };

    await instance.put(
      `/appointments/${editingAppointment.value.id}`,
      appointmentData
    );

    // Refrescar las citas
    await fetchAppointments();
    closeEditModal();

    // Mostrar mensaje de éxito
    notificationStore.addNotification(
      "success",
      "notifications.success", 
      t("calendar.appointment-updated-successfully")
    );
  } catch (e) {
    console.error("Error al guardar la cita:", e);
    notificationStore.addNotification(
      "error",
      "notifications.error",
      t("calendar.error-updating-appointment")
    );
  }
}

// Estado para el modal de confirmación de eliminación
const showDeleteConfirmation = ref(false);
// Variable para guardar la cita a eliminar (independiente de editingAppointment)
const appointmentToDelete = ref(null);

// Función para obtener color según estado de la cita
function getColorByStatus(status) {
  switch(status.toLowerCase()) {
    case 'confirmado':
      return "#4caf50";  // verde
    case 'pendiente':
      return "#1976d2";  // azul
    case 'cancelado':
      return "#f44336";  // rojo
    case 'completado':
      return "#9c27b0";  // morado
    case 'espera':
      return "#ff9800";  // naranja
    default:
      return "#1976d2";  // azul por defecto
  }
}

async function deleteAppointment() {
  // Guardar la cita actual para eliminar
  appointmentToDelete.value = {...editingAppointment.value};
  
  // Mostrar modal de confirmación en lugar de usar confirm nativo
  showDeleteConfirmation.value = true;
}

// Función para confirmar la eliminación
async function confirmDelete() {
  showDeleteConfirmation.value = false;
  
  try {
    // Verificar si usa ID o id y asegurarse de que existe
    const appointmentId = appointmentToDelete.value.ID || 
                          appointmentToDelete.value.id || 
                          appointmentToDelete.value.AppointmentID || 
                          appointmentToDelete.value.appointmentId;
    
    if (!appointmentId) {
      throw new Error("No se pudo obtener el ID de la cita para eliminar");
    }
    
    // Intentar eliminar la cita
    await instance.delete(`/appointments/${appointmentId}`);

    // Refrescar las citas
    await fetchAppointments();
    closeEditModal();
    
    // Limpiar la referencia a la cita eliminada
    appointmentToDelete.value = null;

    // Mostrar mensaje de éxito
    notificationStore.addNotification(
      "success",
      "notifications.success",
      t("calendar.appointment-deleted-successfully")
    );
  } catch {
    notificationStore.addNotification(
      "error", 
      "notifications.error",
      t("calendar.error-deleting-appointment") || "Error al eliminar la cita"
    );
  }
}

function closeEditModal() {
  showEditModal.value = false;
  // Solo limpiamos editingAppointment si no estamos en proceso de eliminación
  if (!showDeleteConfirmation.value) {
    editingAppointment.value = null;
  }
  editForm.value = {
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    status: "Pendiente",
    notes: "",
  };
  searchPatient.value = "";
}

// Modificar la función de eventos para citas para agregar función de edición
function openAppointmentEdit(event) {
  if (event.type === "Cita") {
    // Buscar la cita original en appointments
    const appointment = appointments.value.find((app) =>
      // Ahora comparamos con el nombre del paciente directamente
      (app.PatientName || app.patientName) === event.text
    );
    
    if (appointment) {
      openEditModal(appointment);
    }
  }
}

onMounted(() => {
  fetchAppointments();
  fetchPatients();
});
</script>
<template>
  <div
    :class="styles['main-content']"
    data-testid="calendar-root"
  >
    <!-- Header del calendario -->
    <div
      :class="styles['calendar-header']"
      data-testid="calendar-header"
    >
      <button
        :class="styles['calendar-btn']"
        data-testid="calendar-prev-btn"
        aria-label="Mes anterior"
        @click="prevMonth"
      >
        &lt;
      </button>
      <div :class="styles['calendar-title']">
        <span data-testid="calendar-month-name">{{
          months[currentMonth]
        }}</span>
        <button
          :class="styles['calendar-year-btn']"
          data-testid="calendar-year-btn"
          @click="showYearSelect = !showYearSelect"
        >
          {{ currentYear }}
        </button>
        <div
          v-if="showYearSelect"
          :class="styles['year-select']"
          data-testid="year-select"
        >
          <div
            v-for="year in years"
            :key="year"
            :class="styles['year-option']"
            :data-testid="`year-option-${year}`"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>
      <button
        :class="styles['calendar-btn']"
        data-testid="calendar-next-btn"
        aria-label="Mes siguiente"
        @click="nextMonth"
      >
        &gt;
      </button>
    </div>

    <!-- Tabla del calendario -->
    <div
      :class="styles['calendar-table']"
      data-testid="calendar-table"
    >
      <div
        :class="styles['calendar-row']"
        data-testid="calendar-days-header"
      >
        <div
          v-for="day in days"
          :key="day"
          :class="styles['calendar-day']"
        >
          {{ day }}
        </div>
      </div>
      <div
        v-for="(week, weekIndex) in weeks"
        :key="'week-' + weekIndex"
        :class="styles['calendar-row']"
      >
        <div
          v-for="cell in week"
          :key="'day-' + cell.day + '-' + cell.month + '-' + cell.year"
          :class="[
            styles['calendar-cell'],
            cell.isOtherMonth ? styles['other-month'] : '',
          ]"
          :data-testid="`calendar-cell-${cell.year}-${cell.month}-${cell.day}`"
          @click="dayClicked(cell)"
        >
          <span>{{ cell.day }}</span>
          <div :class="styles['calendar-events']">
            <!--Mostrar evento limitados-->
            <div
              v-for="(event, eventIndex) in getLimitedEventsForDay(cell)
                .visibleEvents"
              :key="'event-' + eventIndex"
              :class="[
                styles['event'],
                styles[`event-${event.type.toLowerCase()}`],
              ]"
              :style="{ backgroundColor: event.color }"
              :data-testid="`calendar-event-${event.type.toLowerCase()}-${eventIndex}`"
            >
              <div :class="styles['event-header']">
                <span :class="styles['event-icon']">
                  {{
                    event.type === "Paciente"
                      ? "👤"
                      : event.type === "Cita"
                        ? "🩺"
                        : "📋"
                  }}
                </span>
                <!-- Mostramos la hora solo para eventos que no son citas -->
                <span
                  v-if="event.type !== 'Cita'"
                  :class="styles['event-time']"
                  data-testid="event-time"
                >
                  {{ event.startTime
                  }}<span v-if="event.endTime">-{{ event.endTime }}</span>
                </span>
              </div>
              <div
                :class="styles['event-text']"
                data-testid="event-text"
              >
                {{
                  event.type === "Cita" && event.displayText
                    ? event.displayText
                    : event.text
                }}
              </div>
            </div>

            <!--Indicador de eventos adicionales-->
            <div
              v-if="getLimitedEventsForDay(cell).remainingCount > 0"
              :class="styles['more-events']"
              data-testid="more-events-indicator"
              @click.stop="dayClicked(cell)"
            >
              +{{ getLimitedEventsForDay(cell).remainingCount }} más
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de actividades del día seleccionado -->
    <div
      v-if="selectedDayObj"
      ref="refDaySelectedAgenda"
      :class="styles['day-agenda-panel']"
      data-testid="day-agenda-panel"
    >
      <h3 data-testid="agenda-title">
        Agenda para el {{ selectedDayObj.day }}/{{
          selectedDayObj.month + 1
        }}/{{ selectedDayObj.year }}
      </h3>

      <ul data-testid="agenda-events-list">
        <li
          v-for="(event, i) in getEventsForDay(selectedDayObj)"
          :key="i"
          :data-testid="`agenda-event-${i}`"
        >
          <template v-if="editingIndex === i">
            <div
              class="edit-fields"
              data-testid="edit-fields"
            >
              <input
                v-model="editingText"
                placeholder="Texto"
                data-testid="edit-text-input"
              />
              <input
                v-model="editingStart"
                type="time"
                data-testid="edit-start-input"
              />
              <input
                v-model="editingEnd"
                type="time"
                placeholder="Fin (opcional)"
                data-testid="edit-end-input"
              />
              <input
                v-model="editingColor"
                type="color"
                data-testid="edit-color-input"
              />
            </div>
            <div class="edit-buttons-centered">
              <button
                data-testid="save-edit-btn"
                @click="saveEdit(i)"
              >
                Guardar
              </button>
              <button
                data-testid="cancel-edit-btn"
                @click="cancelEdit"
              >
                Cancelar
              </button>
            </div>
          </template>
          <template v-else>
            <span data-testid="event-display-text">
              <span v-if="event.type === 'Paciente'">👤 </span>
              <span v-else-if="event.type === 'Cita'">🩺 </span>
              <span v-else>📋 </span>
              {{ event.text }}
            </span>
            <span style="display: flex; align-items: center; gap: 0.7em">
              {{ event.startTime }}
              <template v-if="event.endTime">-{{ event.endTime }}</template>
              <span
                class="color-dot"
                :style="{ background: event.color }"
              ></span>

              <!-- Botones diferentes según el tipo de evento -->
              <template v-if="event.type === 'Cita'">
                <button
                  :class="styles['edit-btn']"
                  data-testid="edit-appointment-btn"
                  @click="openAppointmentEdit(event)"
                >
                  ✏️ Editar Cita
                </button>
              </template>
              <template v-else>
                <button
                  :class="styles['edit-btn']"
                  data-testid="edit-event-btn"
                  @click="startEdit(i, event)"
                >
                  Editar
                </button>
                <button
                  :class="styles['delete-btn']"
                  data-testid="delete-event-btn"
                  @click="deleteEvent(i)"
                >
                  🗑️
                </button>
              </template>
            </span>
          </template>
        </li>
        <li
          v-if="getEventsForDay(selectedDayObj).length === 0"
          data-testid="no-events-message"
        >
          No hay actividades ni pacientes.
        </li>
      </ul>

      <div
        :class="styles['agenda-forms']"
        data-testid="agenda-forms"
      >
        <!-- Pacientes fila -->
        <form
          :class="styles['agenda-form']"
          data-testid="add-patient-form"
          @submit.prevent="addPatientEvent"
        >
          <input
            v-model="selectedPatient"
            placeholder="Buscar o seleccionar paciente"
            required
            data-testid="patient-input"
          />
          <input
            v-model="patientStartTime"
            type="time"
            required
            data-testid="patient-start-time"
          />
          <input
            v-model="patientEndTime"
            type="time"
            placeholder="Fin (opcional)"
            data-testid="patient-end-time"
          />
          <input
            v-model="patientColor"
            type="color"
            title="Color paciente"
            class="color-input"
            data-testid="patient-color"
          />
          <button
            type="submit"
            data-testid="add-patient-btn"
          >
            Añadir paciente
          </button>
        </form>

        <!-- Actividad fila -->
        <form
          :class="styles['agenda-form']"
          data-testid="add-activity-form"
          @submit.prevent="addActivityEvent"
        >
          <input
            v-model="activityText"
            placeholder="Actividad"
            required
            data-testid="activity-input"
          />
          <input
            v-model="activityStartTime"
            type="time"
            required
            data-testid="activity-start-time"
          />
          <input
            v-model="activityEndTime"
            type="time"
            placeholder="Fin (opcional)"
            data-testid="activity-end-time"
          />
          <input
            v-model="activityColor"
            type="color"
            title="Color actividad"
            class="color-input"
            data-testid="activity-color"
          />
          <button
            type="submit"
            data-testid="add-activity-btn"
          >
            Añadir actividad
          </button>
        </form>
      </div>
    </div>

    <!-- Modal de edición de citas con diseño mejorado -->
    <general-dialog-modal
      :isOpen="showEditModal"
      dialogSize="max-w-2xl"
      :cancelButton="true"
      @close-modal="closeEditModal"
    >
      <template #title>
        <p class="text-xl font-semibold">
          {{ t("calendar.edit-appointment") }}
        </p>
      </template>

      <template #body>
        <form
          class="space-y-6"
          data-testid="edit-appointment-form"
          @submit.prevent="saveAppointment"
        >
          <!-- Selector de paciente mejorado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              {{ t("calendar.patient") }}:
            </label>
            <div class="relative">
              <input
                v-model="searchPatient"
                :placeholder="t('calendar.search-patient-placeholder')"
                class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                data-testid="patient-search-input"
                @input="filterPatients"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
              />
              <div
                v-if="
                  showPatientDropdown &&
                    searchPatient &&
                    searchPatient.length > 2 &&
                    filteredPatients.length > 0 &&
                    (!editingAppointment || searchPatient !== editForm.patientName)
                "
                class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                data-testid="patient-dropdown"
              >
                <div
                  v-for="patient in filteredPatients.slice(0, 5)"
                  :key="patient.id"
                  class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                  :data-testid="`patient-option-${patient.id}`"
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

          <!-- Fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("calendar.date") }}:
            </label>
            <input
              v-model="editForm.date"
              type="date"
              required
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              data-testid="edit-date-input"
            />
          </div>

          <!-- Hora -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("calendar.time") }}:
            </label>
            <input
              v-model="editForm.time"
              type="time"
              required
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              data-testid="edit-time-input"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("calendar.status") }}:
            </label>
            <select
              v-model="editForm.status"
              class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              data-testid="edit-status-select"
            >
              <option
                v-for="status in appointmentStatuses"
                :key="status"
                :value="status"
              >
                {{ t(status) }}
              </option>
            </select>
          </div>
        </form>
      </template>

      <template #buttons>
        <div class="flex justify-between space-x-3">
          <!-- Botón eliminar a la izquierda -->
          <button
            type="button"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            data-testid="delete-appointment-btn"
            @click="deleteAppointment"
          >
            {{ t("calendar.delete-appointment") }}
          </button>
          
          <!-- Botones principales a la derecha -->
          <div class="flex space-x-3">
            <button
              type="button"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              data-testid="cancel-modal-btn"
              @click="closeEditModal"
            >
              {{ t("calendar.cancel") }}
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              data-testid="save-appointment-btn"
              @click="saveAppointment"
            >
              {{ t("calendar.save-changes") }}
            </button>
          </div>
        </div>
      </template>
    </general-dialog-modal>
  </div>

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
</template>
