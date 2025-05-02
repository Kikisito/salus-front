<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { date, Dialog, Loading, Notify } from 'quasar'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import AppointmentSlotDialog from 'src/components/admin/appointment-slots/AppointmentSlotDialog.vue'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useRoomStore } from 'src/stores/RoomStore'
import AppointmentsCalendar from 'src/components/AppointmentsCalendar.vue'

const route = useRoute()

const roomStore = useRoomStore()

const doctorStore = useDoctorStore()
const { inspectedDoctor } = storeToRefs(doctorStore)

const appointmentSlotStore = useAppointmentSlotStore()
const { slots } = storeToRefs(appointmentSlotStore)

const appointmentStore = useAppointmentStore()

const rawDoctorId: string = route.params.id as string
const doctorId = parseInt(rawDoctorId)

async function showAppointmentSlot(appointmentSlot: AppointmentSlot) {
  Loading.show({
    message: 'Cargando información del turno...',
  })

  let appointment = null
  if (appointmentSlot.appointmentId) {
    const response = await appointmentStore.getAppointment(appointmentSlot.appointmentId)

    if (!response.success) {
      Notify.create({
        type: 'negative',
        message: 'Error al cargar la cita. Algunos datos se mostrarán incompletos.',
      })
      Loading.hide()
      return
    } else {
      appointment = response.data
    }
  }

  Dialog.create({
    component: AppointmentSlotDialog,
    componentProps: {
      appointmentSlot: appointmentSlot,
      appointment: appointment,
      getRooms: roomStore.getAllRooms,
      searchRooms: roomStore.searchRooms,
    },
    persistent: true,
  })

  Loading.hide()
}

async function createAppointmentDialog() {
  Dialog.create({
    component: AppointmentSlotDialog,
    componentProps: {
      appointmentSlot: null,
      appointment: null,
      specialties: inspectedDoctor.value?.specialties,
      getRooms: roomStore.getAllRooms,
      searchRooms: roomStore.searchRooms,
    },
    persistent: true,
  }).onOk(async (data) => {
    if (data) {
      // Le asignamos el ID del médico del perfil al hueco de cita
      data.doctor = doctorId
      const response = await appointmentSlotStore.addAppointmentSlot(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'El hueco de cita se ha creado correctamente.',
        })
      } else {
        Notify.create({
          type: 'negative',
          message: response.error || 'Error al crear el hueco de cita.',
        })
      }
    }
  })
}

async function deleteAppointmentSlot(appointmentSlot: AppointmentSlot) {
  Dialog.create({
    title: 'Eliminar hueco de cita',
    message: '¿Estás seguro de que deseas eliminar este hueco de cita?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await appointmentSlotStore.deleteAppointmentSlot(appointmentSlot.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'El hueco de cita se ha eliminado correctamente.',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error || 'Error al eliminar el hueco de cita.',
      })
    }
  })
}

async function getData(d: string = new Date().toISOString()) {
  Loading.show({
    message: 'Cargando información...',
  })

  if (doctorId) {
    await doctorStore.getDoctorData(doctorId)
    await appointmentSlotStore.getDoctorAppointmentSlots(doctorId, date.formatDate(d, 'YYYY-MM-DD'))
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
                <div class="text-h6">Agenda de citas y huecos</div>
                <q-space />

                <q-btn
                  v-if="inspectedDoctor.specialties.length > 0"
                  color="primary"
                  label="Añadir hueco"
                  icon="add"
                  class="q-mr-sm"
                  size="sm"
                  @click="createAppointmentDialog()"
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

              <AppointmentsCalendar
                v-model:appointment-slots="slots"
                @appointment-slot:click="showAppointmentSlot($event)"
                @appointment-slot:context="deleteAppointmentSlot($event)"
                @update:model-value="getData($event)"
              />

              <span class="calendar-info">
                Haz click izquierdo para ver los detalles de un hueco o una cita, click derecho para
                eliminarlo
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

.calendar-info {
  color: #6e6e6e;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}
</style>
