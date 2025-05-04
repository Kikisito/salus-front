<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PreviaCita from 'src/components/PreviaCita.vue'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { onMounted } from 'vue'

const appointmentStore = useAppointmentStore()
const { appointments } = storeToRefs(appointmentStore)

onMounted(async () => {
  await appointmentStore.getAppointments()
})
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

            <!--<PreviaMensaje v-for="mensaje in mensajes" :key="mensaje.id" :mensaje="mensaje" />-->

            <q-btn
              label="Ver todos mis mensajes"
              flat
              bordered
              @click="$router.push({ name: 'chats' })"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
