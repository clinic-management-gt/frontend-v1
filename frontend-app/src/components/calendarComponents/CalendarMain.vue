<script setup>
import styles from "./CalendarMain.module.css";
import { ref, watch, nextTick, computed } from "vue";
import { onMounted } from "vue";

// Puedes cambiar esto cuando tengas tu componente real
const PatientSearch = {
  template: `<input type="text" placeholder="Buscar paciente..." />`,
};

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const showYearSelect = ref(false);
const selectedDayObj = ref(null);
const events = ref([]); // [{ day, month, year, text, startTime, endTime, color, type }]

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

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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

function saveEdit(i) {
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
    const res = await fetch("http://localhost:9000/appointments");
    if (!res.ok) throw new Error("Error al obtener citas");
    const data = await res.json();
    appointments.value = data;

    // Limpia eventos previos de tipo 'Cita'
    events.value = events.value.filter((e) => e.type !== "Cita");

    // Agrega las citas como eventos
    data.forEach((app) => {
      const date = new Date(app.date || app.appointment_date);
      events.value.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        text: `Cita: ${app.PatientName || app.patientName} (${
          app.Status || app.status
        })`,
        startTime: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: null,
        color: "#1976d2",
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
    const res = await fetch("http://localhost:9000/patients");
    if (!res.ok) throw new Error("Error al obtener pacientes");
    const data = await res.json();
    patients.value = data;
    filteredPatients.value = data;
  } catch (e) {
    console.error("Error al obtener pacientes:", e);
  }
}

const showPatientDropdown = ref(false);

function onSearchFocus() {
  showPatientDropdown.value = true;
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

    const res = await fetch(
      `http://localhost:9000/appointments/${editingAppointment.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      },
    );

    if (!res.ok) throw new Error("Error al actualizar la cita");

    // Refrescar las citas
    await fetchAppointments();
    closeEditModal();

    // Mostrar mensaje de éxito
    alert("Cita actualizada exitosamente");
  } catch (e) {
    console.error("Error al guardar la cita:", e);
    alert("Error al actualizar la cita");
  }
}

async function deleteAppointment() {
  if (!confirm("¿Estás seguro de que quieres eliminar esta cita?")) return;

  try {
    const res = await fetch(
      `http://localhost:9000/appointments/${editingAppointment.value.id}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) throw new Error("Error al eliminar la cita");

    // Refrescar las citas
    await fetchAppointments();
    closeEditModal();

    // Mostrar mensaje de éxito
    alert("Cita eliminada exitosamente");
  } catch (e) {
    console.error("Error al eliminar la cita:", e);
    alert("Error al eliminar la cita");
  }
}

function closeEditModal() {
  showEditModal.value = false;
  editingAppointment.value = null;
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
      event.text.includes(app.PatientName || app.patientName),
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
  <div :class="styles['main-content']" data-testid="calendar-root">
    <!-- Header del calendario -->
    <div :class="styles['calendar-header']" data-testid="calendar-header">
      <button
        @click="prevMonth"
        :class="styles['calendar-btn']"
        data-testid="calendar-prev-btn"
        aria-label="Mes anterior"
      >
        &lt;
      </button>
      <div :class="styles['calendar-title']">
        <span data-testid="calendar-month-name">{{
          monthNames[currentMonth]
        }}</span>
        <button
          @click="showYearSelect = !showYearSelect"
          :class="styles['calendar-year-btn']"
          data-testid="calendar-year-btn"
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
            @click="selectYear(year)"
            :class="styles['year-option']"
            :data-testid="`year-option-${year}`"
          >
            {{ year }}
          </div>
        </div>
      </div>
      <button
        @click="nextMonth"
        :class="styles['calendar-btn']"
        data-testid="calendar-next-btn"
        aria-label="Mes siguiente"
      >
        &gt;
      </button>
    </div>

    <!-- Tabla del calendario -->
    <div :class="styles['calendar-table']" data-testid="calendar-table">
      <div :class="styles['calendar-row']" data-testid="calendar-days-header">
        <div v-for="day in days" :key="day" :class="styles['calendar-day']">
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
          @click="dayClicked(cell)"
          :data-testid="`calendar-cell-${cell.year}-${cell.month}-${cell.day}`"
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
                <span :class="styles['event-time']" data-testid="event-time">
                  {{ event.startTime
                  }}<span v-if="event.endTime">-{{ event.endTime }}</span>
                </span>
              </div>
              <div :class="styles['event-text']" data-testid="event-text">
                {{
                  event.type === "Cita"
                    ? event.text.replace("Cita: ", "")
                    : event.text
                }}
              </div>
            </div>

            <!--Indicador de eventos adicionales-->
            <div
              v-if="getLimitedEventsForDay(cell).remainingCount > 0"
              :class="styles['more-events']"
              @click.stop="dayClicked(cell)"
              data-testid="more-events-indicator"
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
            <div class="edit-fields" data-testid="edit-fields">
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
              <button @click="saveEdit(i)" data-testid="save-edit-btn">
                Guardar
              </button>
              <button @click="cancelEdit" data-testid="cancel-edit-btn">
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
                  @click="openAppointmentEdit(event)"
                  :class="styles['edit-btn']"
                  data-testid="edit-appointment-btn"
                >
                  ✏️ Editar Cita
                </button>
              </template>
              <template v-else>
                <button
                  @click="startEdit(i, event)"
                  :class="styles['edit-btn']"
                  data-testid="edit-event-btn"
                >
                  Editar
                </button>
                <button
                  @click="deleteEvent(i)"
                  :class="styles['delete-btn']"
                  data-testid="delete-event-btn"
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

      <div :class="styles['agenda-forms']" data-testid="agenda-forms">
        <!-- Pacientes fila -->
        <form
          @submit.prevent="addPatientEvent"
          :class="styles['agenda-form']"
          data-testid="add-patient-form"
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
          <button type="submit" data-testid="add-patient-btn">
            Añadir paciente
          </button>
        </form>

        <!-- Actividad fila -->
        <form
          @submit.prevent="addActivityEvent"
          :class="styles['agenda-form']"
          data-testid="add-activity-form"
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
          <button type="submit" data-testid="add-activity-btn">
            Añadir actividad
          </button>
        </form>
      </div>
    </div>

    <!-- Modal de edición de citas -->
    <div
      v-if="showEditModal"
      :class="styles['modal-overlay']"
      @click="closeEditModal"
      data-testid="edit-modal-overlay"
    >
      <div
        :class="styles['modal-content']"
        @click.stop
        data-testid="edit-modal-content"
      >
        <div :class="styles['modal-header']">
          <h3>Editar Cita Médica</h3>
          <button
            @click="closeEditModal"
            :class="styles['close-btn']"
            data-testid="close-modal-btn"
          >
            &times;
          </button>
        </div>

        <div :class="styles['modal-body']">
          <form
            @submit.prevent="saveAppointment"
            data-testid="edit-appointment-form"
          >
            <!-- Selector de paciente mejorado -->
            <div :class="styles['form-group']">
              <label>Paciente:</label>
              <div :class="styles['patient-search']">
                <input
                  v-model="searchPatient"
                  @input="filterPatients"
                  @focus="onSearchFocus"
                  @blur="onSearchBlur"
                  placeholder="Escriba para buscar paciente..."
                  :class="styles['search-input']"
                  data-testid="patient-search-input"
                />
                <div
                  v-if="
                    showPatientDropdown &&
                    searchPatient &&
                    searchPatient.length > 2 &&
                    filteredPatients.length > 0
                  "
                  :class="styles['patient-dropdown']"
                  data-testid="patient-dropdown"
                >
                  <div
                    v-for="patient in filteredPatients.slice(0, 5)"
                    :key="patient.id"
                    @mousedown="selectPatient(patient)"
                    :class="styles['patient-option']"
                    :data-testid="`patient-option-${patient.id}`"
                  >
                    <strong>{{ patient.name }}</strong>
                    <span>{{ patient.email }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fecha -->
            <div :class="styles['form-group']">
              <label>Fecha:</label>
              <input
                v-model="editForm.date"
                type="date"
                required
                :class="styles['form-input']"
                data-testid="edit-date-input"
              />
            </div>

            <!-- Hora -->
            <div :class="styles['form-group']">
              <label>Hora:</label>
              <input
                v-model="editForm.time"
                type="time"
                required
                :class="styles['form-input']"
                data-testid="edit-time-input"
              />
            </div>

            <!-- Estado -->
            <div :class="styles['form-group']">
              <label>Estado:</label>
              <select
                v-model="editForm.status"
                :class="styles['form-select']"
                data-testid="edit-status-select"
              >
                <option
                  v-for="status in appointmentStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </div>

            <!-- Botones -->
            <div :class="styles['modal-actions']">
              <button
                type="submit"
                :class="styles['save-btn']"
                data-testid="save-appointment-btn"
              >
                💾 Guardar Cambios
              </button>
              <button
                type="button"
                @click="deleteAppointment"
                :class="styles['delete-btn']"
                data-testid="delete-appointment-btn"
              >
                🗑️ Eliminar Cita
              </button>
              <button
                type="button"
                @click="closeEditModal"
                :class="styles['cancel-btn']"
                data-testid="cancel-modal-btn"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
