<script setup>
import styles from './CalendarMain.module.css'
import { ref, computed } from 'vue'

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const showYearSelect = ref(false)
const selectedDay = ref(null)
const events = ref([]) // [{ day: 5, month: 5, year: 2024, text: 'Cita' }]

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

const calendarCells = computed(() => {
  const cells = []
  for (let i = 0; i < firstDayOfWeek.value; i++) {
    cells.push('')
  }
  for (let d = 1; d <= daysInMonth.value; d++) {
    cells.push(d)
  }
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

function selectYear(year) {
  currentYear.value = year
  showYearSelect.value = false
}

// Agregar evento
const showEventModal = ref(false)
const newEventText = ref('')

function dayClicked(day) {
  if (!day) return
  selectedDay.value = day
  newEventText.value = ''
  showEventModal.value = true
}

function addEvent() {
  if (newEventText.value && selectedDay.value) {
    events.value.push({
      day: selectedDay.value,
      month: currentMonth.value,
      year: currentYear.value,
      text: newEventText.value
    })
    showEventModal.value = false
  }
}

function getEventForDay(day) {
  return events.value.find(
    e => e.day === day && e.month === currentMonth.value && e.year === currentYear.value
  )
}
</script>

<template>
  <div :class="styles['main-content']">
    <div :class="styles.calendar">
      <div :class="styles['calendar-header']">
        <button @click="prevMonth">&lt;</button>
        <span>{{ monthNames[currentMonth] }}</span>
        <button @click="nextMonth">&gt;</button>
        <span style="margin-left: 1rem;">
          <button @click="showYearSelect = !showYearSelect" style="background:none;border:none;font-weight:bold;cursor:pointer;">
            {{ currentYear }}
          </button>
          <div v-if="showYearSelect" style="position:absolute; background:#fff; border:1px solid #ccc; z-index:10; padding:0.5rem;">
            <div v-for="year in years" :key="year" @click="selectYear(year)" style="cursor:pointer;">{{ year }}</div>
          </div>
        </span>
      </div>
      <div :class="styles['calendar-grid']">
        <div v-for="day in days" :key="day" :class="styles['calendar-day']">{{ day }}</div>
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          :class="styles['calendar-cell']"
          @click="dayClicked(cell)"
          style="cursor:pointer; position:relative;"
        >
          <span>{{ cell }}</span>
          <div v-if="getEventForDay(cell)" style="background:#4caf50;color:#fff;border-radius:4px;padding:2px 4px;font-size:0.8em; margin-top:4px;">
            {{ getEventForDay(cell).text }}
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para agregar evento -->
    <div v-if="showEventModal" style="position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.2);z-index:1000;">
      <div style="background:#fff;padding:2rem;border-radius:8px;min-width:300px;">
        <h3>Agregar evento al día {{ selectedDay }}</h3>
        <input v-model="newEventText" placeholder="Descripción" style="width:100%;margin-bottom:1rem;" />
        <div style="display:flex;gap:1rem;justify-content:flex-end;">
          <button @click="addEvent">Agregar</button>
          <button @click="showEventModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>