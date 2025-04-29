<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Dialog, Notify } from 'quasar'
import NewAppointmentDialog from 'src/components/appointments/NewAppointmentDialog.vue'
import PreviaCita from 'src/components/PreviaCita.vue'
import type { Appointment } from 'src/interfaces/Appointment'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { onMounted, ref } from 'vue'

const appointmentStore = useAppointmentStore()
const { appointments } = storeToRefs(appointmentStore)
const pastAppointments = ref<Appointment[]>([])

async function newAppointment() {
  Dialog.create({
    component: NewAppointmentDialog,
    componentProps: {},
  })
}

async function showPastAppointments() {
  const response = await appointmentStore.getPastAppointments()
  if (response.success) {
    pastAppointments.value = response.data
  } else {
    Notify.create({
      message: 'Error al cargar las citas pasadas',
      color: 'negative',
      position: 'top',
    })
  }
}

onMounted(async () => {
  await appointmentStore.getAppointments()
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Tus próximas citas</div>
          <div class="text-subtitle">Consulta tus próximas citas</div>
        </div>

        <template v-if="appointments.length > 0">
          <PreviaCita
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            @appointment:show="$router.push({ name: 'appointment', params: { id: $event.id } })"
          />
        </template>

        <template v-else>
          <q-card flat bordered class="text-center q-pa-lg">
            <div>
              <q-icon name="event_busy" color="grey-7" size="5em" />
            </div>
            <div class="text-h6 q-mt-md">No tienes citas programadas</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Cuando reserves una cita con tu médico, aparecerá aquí
            </div>
            <q-btn
              color="primary"
              label="Solicitar una cita"
              class="q-mt-lg"
              icon="add_circle"
              size="large"
              @click="newAppointment()"
            />
          </q-card>
        </template>

        <div class="text-caption text-center">
          <q-btn
            v-if="pastAppointments.length === 0"
            color="primary"
            flat
            label="Ver citas antiguas"
            @click="showPastAppointments()"
          />
        </div>

        <template v-if="pastAppointments.length > 0">
          <div class="section-header q-mt-lg">
            <div class="text-h6">Citas antiguas</div>
          </div>

          <PreviaCita
            v-for="appointment in pastAppointments"
            class="bg-red-1"
            :key="appointment.id"
            :appointment="appointment"
            @appointment:show="$router.push({ name: 'appointment', params: { id: $event.id } })"
          />
        </template>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" class="bg-primary text-white" @click="newAppointment()" />
    </q-page-sticky>
  </q-page>
</template>
