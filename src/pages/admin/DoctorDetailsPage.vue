<script lang="ts" setup>
import type { Timestamp } from '@quasar/quasar-ui-qcalendar'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { Dialog, Loading, Notify } from 'quasar'
import DoctorSpecialtiesDialog from 'src/components/admin/doctors/DoctorSpecialtiesDialog.vue'
import { useScheduleStore } from 'src/stores/ScheduleStore'
import type { MedicalAgenda } from 'src/interfaces/MedicalAgenda'
import ScheduleEntryForm from 'src/components/admin/doctors/ScheduleEntryForm.vue'
import { useRoomStore } from 'src/stores/RoomStore'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'
import GenerateSlotsFromDateRangeDialog from 'src/components/appointments/GenerateSlotsFromDateRangeDialog.vue'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'

const route = useRoute()
const router = useRouter()

const doctorStore = useDoctorStore()
const { inspectedDoctor } = storeToRefs(doctorStore)

const scheduleStore = useScheduleStore()
const { schedules } = storeToRefs(scheduleStore)

const appointmentSlotStore = useAppointmentSlotStore()

const roomStore = useRoomStore()

const rawDoctorId: string = route.params.id as string
const doctorId = parseInt(rawDoctorId)

const calendar = ref<QCalendarDay>()

const getEvents = (timestamp: Timestamp) => {
  return schedules.value.filter((event) => {
    // Parse time from "hh:mm:ss" format
    const [eventHour] = event.startTime.split(':').map(Number)

    // Convert enum string to corresponding weekday number
    const weekdayMap: Record<string, number> = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 0,
    }
    const eventWeekday = weekdayMap[event.dayOfWeek]

    return eventWeekday === timestamp.weekday && eventHour === timestamp.hour
  })
}

async function changeLicense() {
  Dialog.create({
    title: 'Modificar número de colegiado',
    message: 'Introduce el nuevo número de colegiado',
    prompt: {
      model: inspectedDoctor.value!.license,
      type: 'text',
      label: 'Número de colegiado',
      required: true,
      rules: [(val: string) => !!val || 'El número de colegiado es obligatorio'],
    },
    cancel: true,
    persistent: true,
  }).onOk(async (license) => {
    const response = await doctorStore.changeLicense(inspectedDoctor.value!.id, license)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Número de colegiado modificado correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  })
}

async function manageSpecialties() {
  Dialog.create({
    component: DoctorSpecialtiesDialog,
    componentProps: {
      medicalProfile: inspectedDoctor.value,
    },
    persistent: true,
  })
}

async function deleteMedicalProfile() {
  Dialog.create({
    title: 'Eliminar perfil médico',
    message: '¿Estás seguro de que quieres eliminar este perfil médico?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({
      message: 'Eliminando perfil médico...',
    })

    const response = await doctorStore.deleteMedicalProfile(inspectedDoctor.value!.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Perfil médico eliminado correctamente',
      })
      router.push({ name: 'admin-doctors' })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function addScheduleEntry() {
  Dialog.create({
    component: ScheduleEntryForm,
    componentProps: {
      medicalProfile: inspectedDoctor.value,
      schedule: null,
      getRooms: roomStore.getAllRooms,
      searchRooms: roomStore.searchRooms,
    },
    persistent: true,
  }).onOk(async (scheduleEntry) => {
    Loading.show({
      message: 'Añadiendo turno...',
    })

    const rawEntry = {
      ...scheduleEntry,
      doctor: scheduleEntry.doctor.id,
    }

    const response = await scheduleStore.addScheduleEntry(rawEntry)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Turno añadido correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function updateScheduleEntry(event: MedicalAgenda) {
  Dialog.create({
    component: ScheduleEntryForm,
    componentProps: {
      medicalProfile: inspectedDoctor.value,
      schedule: event,
      getRooms: roomStore.getAllRooms,
      searchRooms: roomStore.searchRooms,
    },
    persistent: true,
  }).onOk(async (scheduleEntry) => {
    Loading.show({
      message: 'Actualizando turno...',
    })

    const rawEntry = {
      ...scheduleEntry,
      doctor: scheduleEntry.doctor.id,
      specialty:
        typeof scheduleEntry.specialty === 'object'
          ? scheduleEntry.specialty.id
          : scheduleEntry.specialty,
      room: typeof scheduleEntry.room === 'object' ? scheduleEntry.room.id : scheduleEntry.room,
    }

    const response = await scheduleStore.updateScheduleEntry(rawEntry)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Turno actualizado correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function deleteScheduleEntry(event: MedicalAgenda) {
  Dialog.create({
    title: 'Eliminar turno',
    message: '¿Estás seguro de que quieres eliminar este turno?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({
      message: 'Eliminando turno...',
    })

    const response = await scheduleStore.deleteScheduleEntry(event.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Turno eliminado correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function generateSlotsBySchedule(event: MedicalAgenda) {
  Dialog.create({
    title: 'Generar citas según un turno',
    message:
      'Selecciona la fecha para la que deseas generar las citas. Ten en cuenta que debes seleccionar un día de la semana que coincida con el turno.',
    prompt: {
      model: '',
      type: 'date',
      label: 'Fecha',
      isValid: (val: string) => {
        const date = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return date >= today
      },
    },
    cancel: true,
    persistent: true,
  }).onOk(async (selectedDate) => {
    Loading.show({
      message: 'Generando citas...',
    })

    const response = await appointmentSlotStore.generateSlotsByScheduleAndDate(
      event.id,
      selectedDate,
    )

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Huecos de cita generados correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function generateSlotsByDoctorAndDateRange(doctor: MedicalProfile) {
  Dialog.create({
    component: GenerateSlotsFromDateRangeDialog,
    componentProps: {
      title: 'Generación de citas en un rango de fechas',
      persistent: true,
    },
  }).onOk(async (data) => {
    Loading.show({
      message: 'Generando citas...',
    })

    const response = await appointmentSlotStore.generateSlotsByDoctorAndDateRange(
      doctor.id,
      data.startDate,
      data.endDate,
    )

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Huecos de cita generados correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}

async function getData() {
  Loading.show({
    message: 'Cargando información del médico...',
  })

  if (doctorId) {
    await doctorStore.getDoctorData(doctorId)
    await scheduleStore.getDoctorSchedules(doctorId)
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
function calculateTop(event: MedicalAgenda): string {
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

  const top: number = (startMinutes / 60) * 64
  return top + 'px'
}

function calculateHeight(event: MedicalAgenda): string {
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

  // Cada hora equivale a 64px, por lo que (Horas * 64 + ((minutos / 60) * 64))
  const height: number = (endHour - startHour) * 64 + ((endMinutes - startMinutes) / 60) * 64
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
              v-for="especialidad in inspectedDoctor.specialties"
              :key="especialidad.id"
              color="secondary"
              class="q-mr-xs q-mb-xs"
              text-color="white"
            >
              {{ especialidad.name }}
            </q-badge>
            <q-badge v-if="!inspectedDoctor.specialties?.length" color="grey" text-color="white">
              Sin especialidades
            </q-badge>
          </div>

          <div v-else>
            <div class="text-h6">Perfil del médico</div>
            <div class="text-subtitle">Revisa y mantén actualizados los datos de los médicos</div>
          </div>

          <q-space />

          <q-btn-dropdown label="Acciones" color="primary" icon="settings" rounded>
            <q-list>
              <!-- Agenda -->
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-avatar icon="edit_calendar" />
                </q-item-section>

                <q-item-section
                  @click="
                    $router.push({ name: 'admin-doctor-appointments', params: { id: doctorId } })
                  "
                >
                  <q-item-label>Agenda</q-item-label>
                  <q-item-label caption>
                    Consulta y modifica las citas y slots del médico
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!-- Especialidades -->
              <q-item clickable v-close-popup @click="manageSpecialties()">
                <q-item-section avatar>
                  <q-avatar icon="person_add" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Modificar especialidades</q-item-label>
                  <q-item-label caption>Modifica las especialidades del médico</q-item-label>
                </q-item-section>
              </q-item>

              <!-- Número de colegiado -->
              <q-item clickable v-close-popup @click="changeLicense()">
                <q-item-section avatar>
                  <q-avatar icon="edit" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Modificar número de colegiado</q-item-label>
                  <q-item-label caption>Modifica el número de colegiado del médico</q-item-label>
                </q-item-section>
              </q-item>

              <!-- Eliminar perfil como médico -->
              <q-item clickable v-close-popup @click="deleteMedicalProfile()">
                <q-item-section avatar>
                  <q-avatar icon="delete" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Eliminar rol de médico</q-item-label>
                  <q-item-label caption>Elimina el rol de médico del usuario.</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <!-- Datos del médico -->
        <template v-if="inspectedDoctor">
          <div class="row">
            <div class="col-12">
              <div class="row section-header">
                <div class="text-h6">Turnos de trabajo</div>
                <q-space />
                <q-btn
                  v-if="inspectedDoctor.specialties.length > 0"
                  color="green"
                  label="Generar huecos en un rango de fechas"
                  icon="add"
                  class="q-mr-sm"
                  size="sm"
                  @click="generateSlotsByDoctorAndDateRange(inspectedDoctor)"
                />

                <q-btn
                  v-if="inspectedDoctor.specialties.length > 0"
                  color="primary"
                  label="Añadir turno"
                  icon="add"
                  class="q-mr-sm"
                  size="sm"
                  @click="addScheduleEntry()"
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
                :interval-start="6"
                :interval-minutes="60"
                :interval-count="16"
                :interval-height="64"
                hour24-format
                no-default-header-btn
                bordered
              >
                <template #day-interval="{ scope }">
                  <template v-for="(event, index) in getEvents(scope.timestamp)" :key="index">
                    <div
                      class="calendar-event"
                      :style="{
                        top: calculateTop(event),
                        height: calculateHeight(event),
                      }"
                      @click="updateScheduleEntry(event)"
                    >
                      <q-menu touch-position context-menu auto-close>
                        <q-list dense>
                          <q-item
                            class="bg-green text-white"
                            clickable
                            v-close-popup
                            @click="generateSlotsBySchedule(event)"
                          >
                            <q-item-section avatar>
                              <q-icon name="auto_stories" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>Generar citas</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item
                            class="bg-red text-white"
                            clickable
                            v-close-popup
                            @click="deleteScheduleEntry(event)"
                          >
                            <q-item-section avatar>
                              <q-icon name="delete" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>Eliminar turno</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <span>{{ event.specialty.name }}</span>
                      <span>{{ event.room.name }}</span>
                      <span style="font-size: 9px">
                        {{ event.startTime.split(':').slice(0, 2).join(':') }} a
                        {{ event.endTime.split(':').slice(0, 2).join(':') }}
                      </span>
                    </div>
                  </template>
                </template>
              </q-calendar-day>
              <span class="calendar-info">
                Haz click izquierdo para editar un turno, click derecho para abrir el menú
                contextual.
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
  color: white;
  padding: 2px;
  border-radius: 4px;
  border: 1px solid darkblue;
  font-size: 12px;
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;

  span {
    display: block;
  }

  span:first-child {
    font-weight: bold;
  }
}

.calendar-info {
  color: #6e6e6e;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}
</style>
