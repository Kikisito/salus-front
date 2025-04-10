<script lang="ts" setup>
import type { Timestamp } from '@quasar/quasar-ui-qcalendar'
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDoctorStore } from 'src/stores/admin/DoctorStore'
import { Dialog, Notify } from 'quasar'
import DoctorSpecialtiesDialog from 'src/components/admin/doctors/DoctorSpecialtiesDialog.vue'

const route = useRoute()
const doctorStore = useDoctorStore()

const { inspectedDoctor } = storeToRefs(doctorStore)

const rawDoctorId: string = route.params.id as string
const doctorId = parseInt(rawDoctorId)

const loading = ref(false)
const calendar = ref<QCalendarDay>()

const getEvents = (timestamp: Timestamp) => {
  const mockEvents = [
    {
      id: 1,
      especialidad: 'Cardiología',
      start: new Date('2023-10-01T09:10:00').toISOString(),
      end: new Date('2023-10-01T12:30:00').toISOString(),
      weekday: 1,
    },
    {
      id: 2,
      especialidad: 'Pediatría',
      start: new Date('2023-10-02T11:25:00').toISOString(),
      end: new Date('2023-10-02T12:00:00').toISOString(),
      weekday: 2,
    },
  ]

  return mockEvents.filter((event) => {
    const eventDate = new Date(event.start)
    const eventWeekday = eventDate.getDay()

    const eventHour = eventDate.getHours()
    console.log('timestamp', timestamp)

    return eventWeekday === timestamp.weekday && eventHour === timestamp.hour
  })
}

async function changeLicense() {
  Dialog.create({
    title: 'Modificar número de colegiado',
    message: 'Introduce el nuevo número de colegiado',
    prompt: {
      model: inspectedDoctor.value!.numeroColegiado,
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

async function getData() {
  loading.value = true
  if (doctorId) {
    await doctorStore.getDoctorData(doctorId)
  } else {
    console.error('El ID del usuario no es válido. No se ha podido convertir a número.')
    Notify.create({
      type: 'negative',
      message: 'No se ha podido cargar la información del perfil.',
    })
  }
  loading.value = false
}

onMounted(async () => {
  await getData()
})
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
            <div class="text-subtitle">
              Número de colegiado: {{ inspectedDoctor.numeroColegiado }}
            </div>

            <q-badge
              v-for="especialidad in inspectedDoctor.especialidades"
              :key="especialidad.id"
              color="secondary"
              class="q-mr-xs q-mb-xs"
              text-color="white"
            >
              {{ especialidad.nombre }}
            </q-badge>
            <q-badge v-if="!inspectedDoctor.especialidades?.length" color="grey" text-color="white">
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

              <!-- Agenda -->
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-avatar icon="edit_calendar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Agenda</q-item-label>
                  <q-item-label caption>Consulta y modifica los horarios semanales</q-item-label>
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
                        top: (new Date(event.start).getMinutes() / 60) * 64 + 'px',
                        height:
                          ((new Date(event.end).getTime() - new Date(event.start).getTime()) /
                            (60 * 60 * 1000)) *
                            64 +
                          'px',
                      }"
                    >
                      <span>{{ event.especialidad }}</span>
                      <span style="font-size: 9px">
                        {{
                          new Date(event.start).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        }}
                        a
                        {{
                          new Date(event.end).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        }}
                      </span>
                    </div>
                  </template>
                </template>
              </q-calendar-day>
            </div>
          </div>
        </template>

        <q-card v-else-if="loading">
          <q-card-section>
            <span>Cargando...</span>
          </q-card-section>
        </q-card>

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
</style>
