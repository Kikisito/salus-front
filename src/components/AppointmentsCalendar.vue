<script lang="ts" setup>
import { today, type Timestamp } from '@quasar/quasar-ui-qcalendar'
import { date } from 'quasar'
import { ref } from 'vue'
import CalendarSettings from './CalendarSettings.vue'

import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'

const props = defineProps({
  calendarType: {
    type: String,
    default: 'week',
  },
})

defineEmits(['update:model-value', 'appointment-slot:click', 'appointment-slot:context'])

// Ajustes varios del calendario
const calendar = ref()
const selectedDate = ref(today())
const calendarSettings = ref({
  type: props.calendarType,
  startHour: 8,
  endHour: 22,
  rowHeight: 64,
})

const appointmentSlots = defineModel<AppointmentSlot[]>('appointmentSlots', {
  default: [],
})

const getIntervalCount = () => calendarSettings.value.endHour - calendarSettings.value.startHour

const getEvents = (timestamp: Timestamp) => {
  return appointmentSlots.value.filter((event) => {
    // Parse time from "hh:mm:ss" format
    const [eventHour] = event.startTime.split(':').map(Number)
    const [eventYear, eventMonth, eventDay] = event.date.split('-').map(Number)

    return (
      eventHour === timestamp.hour &&
      eventDay === timestamp.day &&
      eventMonth === timestamp.month &&
      eventYear === timestamp.year
    )
  })
}

// Métodos auxiliares para el diseño del calendario
function calculateTop(event: AppointmentSlot): string {
  const [startHour, startMinutes]: number[] = event.startTime.split(':').map(Number)

  if (
    startHour === undefined ||
    startHour === null ||
    startMinutes === undefined ||
    startMinutes === null
  ) {
    console.error('Error al calcular la posición superior del evento')
    return ''
  }

  const top: number = (startMinutes / 60) * calendarSettings.value.rowHeight
  return top + 'px'
}

function calculateHeight(event: AppointmentSlot): string {
  const [startHour, startMinutes]: number[] = event.startTime.split(':').map(Number)
  const [endHour, endMinutes]: number[] = event.endTime.split(':').map(Number)

  if (
    startHour === undefined ||
    startHour === null ||
    startMinutes === undefined ||
    startMinutes === null ||
    endHour === undefined ||
    endHour === null ||
    endMinutes === undefined ||
    endMinutes === null
  ) {
    console.error('Error al calcular la altura del evento')
    return ''
  }

  // Cada hora equivale a (rowHeight)px, por lo que (Horas * rowHeight.value + ((minutos / 60) * rowHeight.value))
  const height: number =
    (endHour - startHour) * calendarSettings.value.rowHeight +
    ((endMinutes - startMinutes) / 60) * calendarSettings.value.rowHeight
  return height + 'px'
}

function isEventHeightSmall(event: AppointmentSlot): boolean {
  const [startHour, startMinutes] = event.startTime.split(':').map(Number)
  const [endHour, endMinutes] = event.endTime.split(':').map(Number)

  const height =
    (endHour! - startHour!) * calendarSettings.value.rowHeight +
    ((endMinutes! - startMinutes!) / 60) * calendarSettings.value.rowHeight

  // Considerar pequeño si es menos de 50px de altura
  return height < 50
}

// Métodos específicos del calendario
function goToCurrentWeek() {
  calendar.value?.moveToToday()
}

function goToPreviousWeek() {
  calendar.value?.prev()
}

function goToNextWeek() {
  calendar.value?.next()
}
</script>

<template>
  <div class="row q-mb-sm">
    <span class="text-h6">{{ date.formatDate(selectedDate, 'MMMM YYYY') }}</span>
    <q-space />
    <div>
      <q-btn
        flat
        dense
        round
        icon="chevron_left"
        @click="goToPreviousWeek()"
        class="q-mr-xs"
        tooltip="Semana anterior"
      />
      <q-btn flat dense color="primary" label="Hoy" @click="goToCurrentWeek()" class="q-mr-xs" />
      <q-btn
        flat
        dense
        round
        icon="chevron_right"
        @click="goToNextWeek()"
        tooltip="Semana siguiente"
      />
    </div>
    <q-space />
    <q-btn-dropdown
      color="secondary"
      icon="settings"
      label="Configuración"
      class="q-mr-sm"
      flat
      dense
    >
      <CalendarSettings v-model:calendar-settings="calendarSettings" />
    </q-btn-dropdown>
  </div>

  <q-calendar-day
    ref="calendar"
    v-model="selectedDate"
    :view="calendarSettings.type"
    transition-next="slide-left"
    transition-prev="slide-right"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    :interval-start="calendarSettings.startHour"
    :interval-minutes="60"
    :interval-count="getIntervalCount()"
    :interval-height="calendarSettings.rowHeight"
    hour24-format
    animated
    bordered
    no-active-date
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #day-interval="{ scope }">
      <template v-for="(event, index) in getEvents(scope.timestamp)" :key="index">
        <div
          :class="['calendar-event', event.appointmentId ? 'locked-slot' : 'free-slot']"
          :style="{
            top: calculateTop(event),
            height: calculateHeight(event),
          }"
          @click="$emit('appointment-slot:click', event)"
          @contextmenu.prevent="$emit('appointment-slot:context', event)"
        >
          <q-tooltip anchor="center right" self="center left" class="bg-primary text-body2">
            <div>
              <b>{{ event.room.name }}</b>
            </div>
            <div>{{ event.specialty.name }}</div>
            <div>
              {{ event.startTime.split(':').slice(0, 2).join(':') }} a
              {{ event.endTime.split(':').slice(0, 2).join(':') }}
            </div>
          </q-tooltip>
          <template v-if="isEventHeightSmall(event)">
            <span class="event-compact-text">
              {{ event.room.name }} ({{ event.specialty.name }})
            </span>
          </template>

          <template v-else>
            <span>{{ event.room.name }}</span>
            <span>{{ event.specialty.name }}</span>
            <span>
              {{ event.startTime.split(':').slice(0, 2).join(':') }} a
              {{ event.endTime.split(':').slice(0, 2).join(':') }}
            </span>
          </template>
        </div>
      </template>
    </template>
  </q-calendar-day>
</template>

<style lang="css" scoped>
.calendar-event {
  position: absolute;
  background-color: #1976d2;
  border: 1px solid darkblue;
  color: white;
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    display: block;
  }

  span:first-child {
    font-weight: bold;
  }
}

.event-compact-text {
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

.free-slot {
  background-color: #4caf50;
  border: 1px solid #388e3c;
}

.free-slot:hover {
  background-color: #388e3c;
  border: 1px solid #2e7d32;
}

.locked-slot {
  background-color: #f44336;
  border: 1px solid #d32f2f;
}

.locked-slot:hover {
  background-color: #d32f2f;
  border: 1px solid #c62828;
}
</style>
