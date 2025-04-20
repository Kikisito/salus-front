<script lang="ts" setup>
import { Notify, useDialogPluginComponent } from 'quasar'
import { onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import type { Room } from 'src/interfaces/Room'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { Appointment } from 'src/interfaces/Appointment'

const props = defineProps({
  appointmentSlot: {
    type: Object as PropType<AppointmentSlot>,
    required: true,
  },
  appointment: {
    type: Object as PropType<Appointment>,
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

const readonly = ref(false)

// Modelo del formulario
const appointmentSlot = ref<Partial<AppointmentSlot>>(props.appointmentSlot)
const appointment = ref<Partial<Appointment>>(props.appointment) // Cita asignada (opcional)

// Lista de salas disponibles
const rooms = ref<Room[]>([])
const isLoadingRooms = ref(false)

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

onMounted(async () => {
  // Si el id de la cita es 0, significa que es una nueva cita
  if (props.appointmentSlot.id === 0) {
    readonly.value = false
  } else {
    // Si no, es una cita existente y se debe cargar la información
    readonly.value = true
  }
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="schedule" />
        </q-avatar>

        <q-toolbar-title>Hueco de cita</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(appointmentSlot)">
          <div class="text-h6 text-center q-mb-md">Datos de este hueco</div>
          <div class="row q-col-gutter-md">
            <!-- Especialidad -->
            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="appointmentSlot.specialty"
                :options="appointmentSlot.doctor?.specialties"
                option-value="id"
                option-label="name"
                label="Especialidad"
                :rules="[(val) => !!val || 'La especialidad es obligatoria']"
                emit-value
                map-options
                :readonly="readonly"
              />
            </div>

            <!-- Consulta/Sala con filtrado -->
            <div class="col-12 col-sm-6">
              <q-select
                filled
                v-model="appointmentSlot.room"
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
                :readonly="readonly"
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

            <!-- Fecha -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="appointmentSlot.date"
                type="date"
                label="Hora de fin"
                :rules="[
                  (val) => !!val || 'La hora de fin es obligatoria',
                  (val) =>
                    (appointmentSlot.startTime && val > appointmentSlot.startTime) ||
                    'La hora de fin debe ser posterior a la hora de inicio',
                ]"
                :readonly="readonly"
              />
            </div>

            <!-- Hora inicio -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="appointmentSlot.startTime"
                type="time"
                label="Hora de inicio"
                :rules="[(val) => !!val || 'La hora de inicio es obligatoria']"
                :readonly="readonly"
              />
            </div>

            <!-- Hora fin -->
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="appointmentSlot.endTime"
                type="time"
                label="Hora de fin"
                :rules="[
                  (val) => !!val || 'La hora de fin es obligatoria',
                  (val) =>
                    (appointmentSlot.startTime && val > appointmentSlot.startTime) ||
                    'La hora de fin debe ser posterior a la hora de inicio',
                ]"
                :readonly="readonly"
              />
            </div>
          </div>

          <!-- Detalles de la cita asignada -->
          <!-- Paciente -->
          <template v-if="appointment">
            <div class="text-h6 text-center q-mb-md">Datos de la cita asignada</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <!-- Nombre -->
                <q-input
                  filled
                  v-model="appointment.patient.nombre"
                  label="Nombre"
                  :rules="[(val) => !!val || 'El nombre del paciente es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Apellidos -->
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="appointment.patient.apellidos"
                  label="Apellidos"
                  :rules="[(val) => !!val || 'Los apellidos del paciente son obligatorios']"
                  :readonly="readonly"
                />
              </div>

              <!-- DNI -->
              <div class="col-12 col-sm-4">
                <q-input
                  filled
                  v-model="appointment.patient.nif"
                  label="DNI"
                  :rules="[(val) => !!val || 'El DNI del paciente es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Teléfono -->
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="appointment.patient.telefono"
                  label="Teléfono"
                  :rules="[(val) => !!val || 'El teléfono del paciente es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Correo electrónico -->
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="appointment.patient.email"
                  label="Correo electrónico"
                  :rules="[(val) => !!val || 'El correo electrónico del paciente es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Motivo de la cita -->
              <div class="col-12 col-sm-12">
                <q-input
                  filled
                  v-model="appointment.reason"
                  label="Motivo de la cita"
                  :rules="[(val) => !!val || 'El motivo de la cita es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Tipo de cita -->
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="appointment.type"
                  label="Tipo de cita"
                  :rules="[(val) => !!val || 'El tipo de cita es obligatorio']"
                  :readonly="readonly"
                />
              </div>

              <!-- Estado de la cita -->
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model="appointment.status"
                  label="Estado de la cita"
                  :rules="[(val) => !!val || 'El estado de la cita es obligatorio']"
                  :readonly="readonly"
                />
              </div>
            </div>
          </template>

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
