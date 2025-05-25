<script setup>
import styles from './CalendarMain.module.css'
import { ref, computed } from 'vue'
import { onMounted } from 'vue'

// Puedes cambiar esto cuando tengas tu componente real
const PatientSearch = {
  template: `<input type="text" placeholder="Buscar paciente..." />`
}

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const showYearSelect = ref(false)
const selectedDayObj = ref(null)
const events = ref([]) // [{ day, month, year, text, startTime, endTime, color, type }]

/* Paciente */
const selectedPatient = ref('')
const patientStartTime = ref('')
const patientEndTime = ref('')
const patientColor = ref('#4caf50')

/* Actividad */
const activityText = ref('')
const activityStartTime = ref('')
const activityEndTime = ref('')
const activityColor = ref('#ff9800')

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDayObj.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDayObj.value = null
}

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const prevMonthDays = computed(() => {
  const prevMonthLastDate = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const daysArr = []
  for (let i = firstDayOfWeek.value - 1; i >= 0; i--) {
    daysArr.push({
      day: prevMonthLastDate - i,
      month: currentMonth.value === 0 ? 11 : currentMonth.value - 1,
      year: currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
      isOtherMonth: true
    })
  }
  return daysArr
})

const nextMonthDays = computed(() => {
  const daysArr = []
  const totalCells = prevMonthDays.value.length + daysInMonth.value
  const nextDaysCount = (7 - (totalCells % 7)) % 7
  for (let i = 1; i <= nextDaysCount; i++) {
    daysArr.push({
      day: i,
      month: currentMonth.value === 11 ? 0 : currentMonth.value + 1,
      year: currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value,
      isOtherMonth: true
    })
  }
  return daysArr
})

const calendarCells = computed(() => {
  const cells = []
  cells.push(...prevMonthDays.value)
  for (let d = 1; d <= daysInMonth.value; d++) {
    cells.push({
      day: d,
      month: currentMonth.value,
      year: currentYear.value,
      isOtherMonth: false
    })
  }
  cells.push(...nextMonthDays.value)
  return cells
})

const years = computed(() => {
  const arr = []
  for (let y = currentYear.value - 5; y <= currentYear.value + 5; y++) {
    arr.push(y)
  }
  return arr
})

const weeks = computed(() => {
  const cells = calendarCells.value
  const rows = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
})

function selectYear(year) {
  currentYear.value = year
  showYearSelect.value = false
  selectedDayObj.value = null
}

function dayClicked(cell) {
  if (!cell || cell.isOtherMonth) return
  selectedDayObj.value = { ...cell }
  selectedPatient.value = ''
  patientStartTime.value = ''
  patientEndTime.value = ''
  patientColor.value = '#4caf50'
  activityText.value = ''
  activityStartTime.value = ''
  activityEndTime.value = ''
  activityColor.value = '#ff9800'
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
      type: 'Paciente'
    })
    selectedPatient.value = ''
    patientStartTime.value = ''
    patientEndTime.value = ''
    patientColor.value = '#4caf50'
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
      type: 'Actividad'
    })
    activityText.value = ''
    activityStartTime.value = ''
    activityEndTime.value = ''
    activityColor.value = '#ff9800'
  }
}

function getEventsForDay(dayObj) {
  if (!dayObj) return []
  return events.value
    .filter(
      e => e.day === dayObj.day && e.month === dayObj.month && e.year === dayObj.year
    )
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
}

/* --- Edición y Eliminación --- */
const editingIndex = ref(null)      // Índice en la lista visual
const editingEventId = ref(null)    // Índice real en events.value
const editingText = ref('')
const editingStart = ref('')
const editingEnd = ref('')
const editingColor = ref('')

// Computado para acceder a los eventos del día actual fácilmente
const dayEvents = computed(() => getEventsForDay(selectedDayObj.value))

function startEdit(i, event) {
  editingIndex.value = i
  editingText.value = event.text
  editingStart.value = event.startTime
  editingEnd.value = event.endTime || ''
  editingColor.value = event.color
  // Índice real del evento en events.value
  editingEventId.value = events.value.findIndex(e => e === dayEvents.value[i])
}

function saveEdit(i) {
  if (editingEventId.value === null || editingEventId.value === -1) return
  if (editingText.value && editingStart.value) {
    const event = events.value[editingEventId.value]
    event.text = editingText.value
    event.startTime = editingStart.value
    event.endTime = editingEnd.value || null
    event.color = editingColor.value
    editingIndex.value = null
    editingEventId.value = null
  }
}

function cancelEdit() {
  editingIndex.value = null
  editingEventId.value = null
}

function deleteEvent(i) {
  const realIndex = events.value.findIndex(e => e === dayEvents.value[i])
  if (realIndex !== -1) events.value.splice(realIndex, 1)
  if (editingIndex.value === i) {
    editingIndex.value = null
    editingEventId.value = null
  }
}

const appointments = ref([])

async function fetchAppointments() {
  try {
    const res = await fetch('http://localhost:9000/appointments')
    if (!res.ok) throw new Error('Error al obtener citas')
    const data = await res.json()
    appointments.value = data

    // Limpia eventos previos de tipo 'Cita'
    events.value = events.value.filter(e => e.type !== 'Cita')

    // Agrega las citas como eventos
    data.forEach(app => {
      const date = new Date(app.date || app.appointment_date)
      events.value.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        text: `Cita: ${app.PatientName || app.patientName} (${app.Status || app.status})`,
        startTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: null,
        color: '#1976d2',
        type: 'Cita'
      })
    })
  } catch (e) {
    console.error('Error al obtener citas:', e)
  }
}

onMounted(() => {fetchAppointments()})

</script>

<template>
  <div :class="styles['main-content']">
    <!-- Header del calendario -->
    <div :class="styles['calendar-header']">
      <button @click="prevMonth" :class="styles['calendar-btn']">&lt;</button>
      <div :class="styles['calendar-title']">
        <span>{{ monthNames[currentMonth] }}</span>
        <button @click="showYearSelect = !showYearSelect" :class="styles['calendar-year-btn']">
          {{ currentYear }}
        </button>
        <div v-if="showYearSelect" :class="styles['year-select']">
          <div v-for="year in years" :key="year" @click="selectYear(year)" :class="styles['year-option']">
            {{ year }}
          </div>
        </div>
      </div>
      <button @click="nextMonth" :class="styles['calendar-btn']">&gt;</button>
    </div>

    <!-- Tabla del calendario -->
    <div :class="styles['calendar-table']">
      <div :class="styles['calendar-row']">
        <div v-for="day in days" :key="day" :class="styles['calendar-day']">{{ day }}</div>
      </div>
      <div v-for="(week, weekIndex) in weeks" :key="'week-' + weekIndex" :class="styles['calendar-row']">
        <div
          v-for="cell in week"
          :key="'day-' + cell.day + '-' + cell.month + '-' + cell.year"
          :class="[styles['calendar-cell'], cell.isOtherMonth ? styles['other-month'] : '']"
          @click="dayClicked(cell)"
        >
          <span>{{ cell.day }}</span>
          <div :class="styles['calendar-events']">
            <div
              v-for="(event, eventIndex) in getEventsForDay(cell)"
              :key="'event-' + eventIndex"
              :class="styles['event']"
              :style="{ background: event.color }"
            >
              {{ event.type === 'Paciente' ? '👤 ' : '📋 ' }}{{ event.text }}
              <span style="font-size:0.95em;">
                ({{ event.startTime }}<span v-if="event.endTime">-{{ event.endTime }}</span>)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de actividades del día seleccionado -->
    <div v-if="selectedDayObj" :class="styles['day-agenda-panel']">
      <h3>
        Agenda para el {{ selectedDayObj.day }}/{{ selectedDayObj.month + 1 }}/{{ selectedDayObj.year }}
      </h3>

      <ul>
        <li v-for="(event, i) in getEventsForDay(selectedDayObj)" :key="i">
          <template v-if="editingIndex === i">
            <div class="edit-fields">
              <input v-model="editingText" placeholder="Texto" />
              <input v-model="editingStart" type="time" />
              <input v-model="editingEnd" type="time" placeholder="Fin (opcional)" />
              <input v-model="editingColor" type="color" />
            </div>
            <div class="edit-buttons-centered">
              <button @click="saveEdit(i)">Guardar</button>
              <button @click="cancelEdit">Cancelar</button>
            </div>
          </template>
          <template v-else>
            <span>
              <span v-if="event.type === 'Paciente'">👤 </span>
              <span v-else>📋 </span>
              {{ event.text }}
            </span>
            <span style="display: flex; align-items: center; gap: 0.7em;">
              {{ event.startTime }}
              <template v-if="event.endTime">-{{ event.endTime }}</template>
              <span class="color-dot" :style="{ background: event.color }"></span>
              <button @click="startEdit(i, event)">Editar</button>
              <button @click="deleteEvent(i)" style="color: #c62828; font-weight: bold;">🗑️</button>
            </span>
          </template>
        </li>
        <li v-if="getEventsForDay(selectedDayObj).length === 0">
          No hay actividades ni pacientes.
        </li>
      </ul>

      <div :class="styles['agenda-forms']">
        <!-- Pacientes fila -->
        <form @submit.prevent="addPatientEvent" :class="styles['agenda-form']">
          <input v-model="selectedPatient" placeholder="Buscar o seleccionar paciente" required>
          <input v-model="patientStartTime" type="time" required>
          <input v-model="patientEndTime" type="time" placeholder="Fin (opcional)">
          <input v-model="patientColor" type="color" title="Color paciente" class="color-input">
          <button type="submit">Añadir paciente</button>
        </form>

        <!-- Actividad fila -->
        <form @submit.prevent="addActivityEvent" :class="styles['agenda-form']">
          <input v-model="activityText" placeholder="Actividad" required>
          <input v-model="activityStartTime" type="time" required>
          <input v-model="activityEndTime" type="time" placeholder="Fin (opcional)">
          <input v-model="activityColor" type="color" title="Color actividad" class="color-input">
          <button type="submit">Añadir actividad</button>
        </form>
      </div>
    </div>
  </div>
</template>
