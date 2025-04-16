<script lang="ts" setup>
import type { Timestamp } from '@quasar/quasar-ui-qcalendar'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDoctorStore } from 'src/stores/admin/DoctorStore'
import { Loading, Notify } from 'quasar'
import { useAppointmentSlotStore } from 'src/stores/admin/AppointmentSlotStore'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import CalendarSettings from 'src/components/CalendarSettings.vue'

const route = useRoute()

const doctorStore = useDoctorStore()
const { inspectedDoctor } = storeToRefs(doctorStore)

const appointmentSlotStore = useAppointmentSlotStore()
const { slots } = storeToRefs(appointmentSlotStore)

const rawDoctorId: string = route.params.id as string
const doctorId = parseInt(rawDoctorId)

const calendar = ref<QCalendarDay>()
const calendarStartHour = ref(8)
const calendarEndHour = ref(22)
const rowHeight = ref(64)

const getIntervalCount = () => calendarEndHour.value - calendarStartHour.value

const getEvents = (timestamp: Timestamp) => {
  return slots.value.filter((event) => {
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

async function getData() {
  Loading.show({
    message: 'Cargando información del médico...',
  })

  if (doctorId) {
    await doctorStore.getDoctorData(doctorId)
    await appointmentSlotStore.getDoctorAppointmentSlots(doctorId)
  } else {
    console.error('El ID del usuario no es válido. No se ha podido convertir a número.')
    Notify.create({
      type: 'negative',
      message: 'No se ha podido cargar la información del perfil.',
    })
  }

  Loading.hide()
}

onMounted(async () => {
  await getData()
})

// Métodos auxiliares para calcular la posición y altura de los eventos en el calendario
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

  const top: number = (startMinutes / 60) * rowHeight.value
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
    (endHour - startHour) * rowHeight.value + ((endMinutes - startMinutes) / 60) * rowHeight.value
  return height + 'px'
}
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div v-if="inspectedDoctor">
            <div class="text-h6">
              {{ inspectedDoctor.user.nombre }} {{ inspectedDoctor.user.apellidos }}
            </div>
            <div class="text-subtitle">Número de colegiado: {{ inspectedDoctor.license }}</div>

            <q-badge
              v-for="specialty in inspectedDoctor.specialties"
              :key="specialty.id"
              color="secondary"
              class="q-mr-xs q-mb-xs"
              text-color="white"
            >
              {{ specialty.name }}
            </q-badge>
            <q-badge v-if="!inspectedDoctor.specialties?.length" color="grey" text-color="white">
              Sin especialidades
            </q-badge>
          </div>

          <div v-else>
            <div class="text-h6">Perfil del médico</div>
            <div class="text-subtitle">Revisa y mantén actualizados los datos de los médicos</div>
          </div>
        </div>

        <!-- Datos del médico -->
        <template v-if="inspectedDoctor">
          <div class="row">
            <div class="col-12">
              <div class="row section-header">
                <div class="text-h6">Agenda</div>
                <q-space />
                <q-btn-dropdown
                  color="secondary"
                  icon="settings"
                  label="Configuración"
                  class="q-mr-sm"
                  flat
                  dense
                >
                  <CalendarSettings
                    v-model:start-hour="calendarStartHour"
                    v-model:end-hour="calendarEndHour"
                    v-model:height="rowHeight"
                  />
                </q-btn-dropdown>

                <q-btn
                  v-if="inspectedDoctor.specialties.length > 0"
                  color="primary"
                  label="Añadir hueco"
                  icon="add"
                  class="q-mr-sm"
                  size="sm"
                />

                <q-badge
                  v-if="inspectedDoctor.specialties.length === 0"
                  color="grey"
                  text-color="white"
                  class="q-mr-sm"
                >
                  Este médico no tiene especialidades asignadas. No se puede añadir un turno.
                </q-badge>
              </div>

              <q-calendar-day
                ref="calendar"
                view="week"
                :weekdays="[1, 2, 3, 4, 5, 6, 0]"
                :interval-start="calendarStartHour"
                :interval-minutes="60"
                :interval-count="getIntervalCount()"
                :interval-height="rowHeight"
                hour24-format
                bordered
              >
                <template #day-interval="{ scope }">
                  <template v-for="(event, index) in getEvents(scope.timestamp)" :key="index">
                    <div
                      :class="['calendar-event', event.appointmentId ? 'locked-slot' : 'free-slot']"
                      :style="{
                        top: calculateTop(event),
                        height: calculateHeight(event),
                      }"
                    >
                      <q-tooltip
                        anchor="center right"
                        self="center left"
                        class="bg-primary text-body2"
                      >
                        <div>
                          <b>{{ event.room.name }}</b>
                        </div>
                        <div>{{ event.specialty.name }}</div>
                        <div>
                          {{ event.startTime.split(':').slice(0, 2).join(':') }} a
                          {{ event.endTime.split(':').slice(0, 2).join(':') }}
                        </div>
                      </q-tooltip>
                      <span>{{ event.room.name }}</span>
                    </div>
                  </template>
                </template>
              </q-calendar-day>
              <span class="calendar-info">
                Haz click izquierdo para editar un turno, click derecho para eliminarlo
              </span>
            </div>
          </div>
        </template>

        <q-card v-else>
          <q-card-section>
            <span>No se ha podido cargar la información del perfil.</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}

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

.calendar-info {
  color: #6e6e6e;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}
</style>
