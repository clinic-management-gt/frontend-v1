<script setup>
import styles from './CalendarMain.module.css'
import { ref, computed } from 'vue'

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const showYearSelect = ref(false)
const selectedDay = ref(null)
const events = ref([]) // [{ day, month, year, text, color }]
const newEventColor = ref('#4caf50')

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
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const lastDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDay()
})

// Días del mes anterior para rellenar el inicio
const prevMonthDays = computed(() => {
  const prevMonthLastDate = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const days = []
  for (let i = firstDayOfWeek.value - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDate - i,
      month: currentMonth.value === 0 ? 11 : currentMonth.value - 1,
      year: currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value,
      isOtherMonth: true
    })
  }
  return days
})

// Días del mes siguiente para rellenar el final
const nextMonthDays = computed(() => {
  const days = []
  const totalCells = prevMonthDays.value.length + daysInMonth.value
  const nextDaysCount = (7 - (totalCells % 7)) % 7
  for (let i = 1; i <= nextDaysCount; i++) {
    days.push({
      day: i,
      month: currentMonth.value === 11 ? 0 : currentMonth.value + 1,
      year: currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value,
      isOtherMonth: true
    })
  }
  return days
})

// Todos los días a mostrar en el calendario
const calendarCells = computed(() => {
  const cells = []
  // Días del mes anterior
  cells.push(...prevMonthDays.value)
  // Días del mes actual
  for (let d = 1; d <= daysInMonth.value; d++) {
    cells.push({
      day: d,
      month: currentMonth.value,
      year: currentYear.value,
      isOtherMonth: false
    })
  }
  // Días del mes siguiente
  cells.push(...nextMonthDays.value)
  return cells
})

// Cambiar año
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
}

// Agregar evento
const showEventModal = ref(false)
const newEventText = ref('')

function dayClicked(cell) {
  if (!cell || cell.isOtherMonth) return
  selectedDay.value = cell.day
  newEventText.value = ''
  newEventColor.value = '#4caf50'
  showEventModal.value = true
}

function addEvent() {
  if (newEventText.value && selectedDay.value) {
    events.value.push({
      day: selectedDay.value,
      month: currentMonth.value,
      year: currentYear.value,
      text: newEventText.value,
      color: newEventColor.value
    })
    showEventModal.value = false
  }
}

// Mostrar todos los eventos de un día
function getEventsForDay(cell) {
  return events.value.filter(
    e => e.day === cell.day && e.month === cell.month && e.year === cell.year
  )
}


</script>

<template>
  <div :class="styles['main-content']">
    <div :class="styles.calendar">
      <div :class="styles['calendar-header']">
        <button
          @click="prevMonth"
          :class="styles['calendar-btn']"
        >&lt;</button>
        <div :class="styles['calendar-title']">
          <span>{{ monthNames[currentMonth] }}</span>
          <button
            @click="showYearSelect = !showYearSelect"
            :class="styles['calendar-year-btn']"
          >
            {{ currentYear }}
          </button>
          <div v-if="showYearSelect" :class="styles['year-select']">
            <div v-for="year in years" :key="year" @click="selectYear(year)" :class="styles['year-option']">
              {{ year }}
            </div>
          </div>
        </div>
        <button
          @click="nextMonth"
          :class="styles['calendar-btn']"
        >&gt;</button>
      </div>
      <div :class="styles['calendar-grid']">
        <div v-for="day in days" :key="day" :class="styles['calendar-day']">{{ day }}</div>
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          :class="[styles['calendar-cell'], cell.isOtherMonth ? styles['other-month'] : '']"
          @click="dayClicked(cell)"
        >
          <span>{{ cell.day }}</span>
          <div
            v-for="(event, i) in getEventsForDay(cell)"
            :key="i"
            :style="{
              background: event.color,
              color: '#fff',
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '0.8em',
              marginTop: '4px',
              width: '90%',
              wordBreak: 'break-word'
            }"
          >
            {{ event.text }}
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para agregar evento -->
    <div v-if="showEventModal" :class="styles['modal-overlay']">
      <div :class="styles['modal-content']">
        <h3>Agregar evento al día {{ selectedDay }}</h3>
        <input v-model="newEventText" placeholder="Descripción" :class="styles['modal-input']" />
        <label>
          Color:
          <input v-model="newEventColor" type="color" :class="styles['modal-color']" />
        </label>
        <div :class="styles['modal-actions']">
          <button @click="addEvent">Agregar</button>
          <button @click="showEventModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>