<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PreviaCita from 'src/components/PreviaCita.vue'
import PreviaMensaje from 'src/components/PreviaMensaje.vue'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { onMounted } from 'vue'

const appointmentStore = useAppointmentStore()
const { appointments } = storeToRefs(appointmentStore)

onMounted(async () => {
  await appointmentStore.getAppointments()
})

const mensajes = [
  {
    id: 1,
    doctor: 'Dr. Juan Martínez',
    especialidad: 'Fisiología',
    hora: '9:16',
    mensaje: '¡Hola! ¿Cómo te encuentras?',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genfe80258a028351a2c3d02625c5ee034a.jpg',
  },
  {
    id: 2,
    doctor: 'Dr. María Hernández',
    especialidad: 'Alergología',
    hora: 'Ayer',
    mensaje: '¡Hola! ¿Cómo te encuentras?',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genb334052d7d54966fb8382d481530fb2d.jpg',
  },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="row justify-evenly">
          <div class="col-12 col-md-6">
            <div class="section-header">
              <div class="text-h6">Próximas citas</div>
              <div class="text-subtitle">Consulta tus próximas citas</div>
            </div>

            <PreviaCita
              v-for="appointment in appointments"
              :key="appointment.id"
              :appointment="appointment"
              @appointment:show="$router.push({ name: 'appointment', params: { id: $event.id } })"
            />

            <div v-if="appointments.length === 0" class="q-mt-md q-ml-md q-mb-md">
              <span> No tienes citas programadas. </span>
            </div>

            <q-btn
              label="Ver todas mis citas"
              flat
              bordered
              @click="$router.push({ name: 'appointments' })"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="section-header">
              <div class="text-h6">Últimos mensajes</div>
              <div class="text-subtitle">Conversaciones con tus médicos</div>
            </div>

            <PreviaMensaje v-for="mensaje in mensajes" :key="mensaje.id" :mensaje="mensaje" />

            <q-btn label="Ver todos mis mensajes" flat bordered />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
