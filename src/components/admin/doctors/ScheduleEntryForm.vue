<script lang="ts" setup>
import { Notify, useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import type { MedicalAgenda } from 'src/interfaces/MedicalAgenda'
import type { Room } from 'src/interfaces/Room'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import type { PropType } from 'vue'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'

const props = defineProps({
  medicalProfile: {
    type: Object as PropType<MedicalProfile>,
    required: true,
  },
  schedule: {
    type: Object as PropType<MedicalAgenda>,
    required: false,
    default: null,
  },
  getRooms: {
    type: Function as PropType<(page: number, limit: number) => Promise<ServiceAnswer<Room[]>>>,
    required: true,
  },
  searchRooms: {
    type: Function as PropType<
      (search: string, page: number, limit: number) => Promise<ServiceAnswer<Room[]>>
    >,
    required: true,
  },
})

const { dialogRef, onDialogOK } = useDialogPluginComponent()

// Lista de salas disponibles
const rooms = ref<Room[]>([])
const isLoadingRooms = ref(false)

// Modelo del formulario
const scheduleEntry = ref<Partial<MedicalAgenda>>({
  id: props.schedule?.id,
  doctor: props.medicalProfile,
  specialty: props.schedule?.specialty,
  room: props.schedule?.room,
  dayOfWeek: props.schedule?.dayOfWeek,
  startTime: props.schedule?.startTime?.substring(0, 5),
  endTime: props.schedule?.endTime?.substring(0, 5),
  duration: props.schedule?.duration || 15,
})

const weekdays = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
]

const filterRooms = async (val: string, update: (callback: () => void) => void) => {
  update(async () => {
    isLoadingRooms.value = true
    try {
      const response = val ? await props.searchRooms(val, 0, 50) : await props.getRooms(0, 50)

      if (response.success) {
        rooms.value = response.data
      }
    } catch (error) {
      console.error('Error al cargar las salas:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al cargar las salas. No se ha podido abrir la ventana correctamente.',
      })
      dialogRef.value?.hide()
    } finally {
      isLoadingRooms.value = false
    }
  })
}
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="schedule" />
        </q-avatar>

        <q-toolbar-title>Turno de trabajo</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(scheduleEntry)">
          <div class="row q-col-gutter-md">
            <!-- Especialidad -->
            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="scheduleEntry.specialty"
                :options="medicalProfile.specialties"
                option-value="id"
                option-label="name"
                label="Especialidad"
                :rules="[(val) => !!val || 'La especialidad es obligatoria']"
                emit-value
                map-options
              />
            </div>

            <!-- Día de la semana -->
            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="scheduleEntry.dayOfWeek"
                :options="weekdays"
                option-value="value"
                option-label="label"
                label="Día de la semana"
                :rules="[(val) => !!val || 'El día de la semana es obligatorio']"
                emit-value
                map-options
              />
            </div>

            <!-- Consulta/Sala con filtrado -->
            <div class="col-12">
              <q-select
                filled
                v-model="scheduleEntry.room"
                :options="rooms"
                option-value="id"
                option-label="name"
                label="Consulta médica"
                :rules="[(val) => !!val || 'La consulta es obligatoria']"
                :loading="isLoadingRooms"
                use-input
                input-debounce="300"
                @filter="filterRooms"
                emit-value
                map-options
                clearable
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section> No se encontraron resultados </q-item-section>
                  </q-item>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.medicalCenter?.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Hora inicio -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="scheduleEntry.startTime"
                type="time"
                label="Hora de inicio"
                :rules="[(val) => !!val || 'La hora de inicio es obligatoria']"
              />
            </div>

            <!-- Hora fin -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="scheduleEntry.endTime"
                type="time"
                label="Hora de fin"
                :rules="[
                  (val) => !!val || 'La hora de fin es obligatoria',
                  (val) =>
                    (scheduleEntry.startTime && val > scheduleEntry.startTime) ||
                    'La hora de fin debe ser posterior a la hora de inicio',
                ]"
              />
            </div>

            <!-- Duración cita -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model.number="scheduleEntry.duration"
                type="number"
                label="Duración de cita"
                :rules="[
                  (val) => !!val || 'La duración es obligatoria',
                  (val) => val > 0 || 'La duración debe ser mayor que cero',
                ]"
                suffix="minutos"
              />
            </div>
          </div>

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
