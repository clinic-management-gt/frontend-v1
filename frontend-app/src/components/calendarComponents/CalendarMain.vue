<script setup>
import styles from './CalendarMain.module.css'
import { ref, computed } from 'vue'

// Simula tu componente PatientSearch (puedes comentar cuando lo tengas real)
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
         <span>
            <span v-if="event.type === 'Paciente'">👤 </span>
            <span v-else>📋 </span>
            {{ event.text }}
         </span>
         <span style="display: flex; align-items: center; gap: 0.6em;">
            {{ event.startTime }}
            <template v-if="event.endTime">-{{ event.endTime }}</template>
            <!-- Viñeta de color más grande -->
            <span
            :style="{
               background: event.color,
               borderRadius: '50%',
               marginLeft: '0.7rem',
               display: 'inline-block',
               width: '28px',
               height: '28px',
               border: '2px solid #fff',
               boxShadow: '0 0 0 1.5px #ccc'
            }"
            ></span>
         </span>
      </li>
      <li v-if="getEventsForDay(selectedDayObj).length === 0">No hay actividades ni pacientes.</li>
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
