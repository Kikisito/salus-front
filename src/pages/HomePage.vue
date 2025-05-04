<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PreviaCita from 'src/components/PreviaCita.vue'
import PreviaMensaje from 'src/components/PreviaMensaje.vue'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useChatStore } from 'src/stores/ChatStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'

const loading = ref(true)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const appointmentStore = useAppointmentStore()
const { appointments } = storeToRefs(appointmentStore)

const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

onMounted(async () => {
  await appointmentStore.getAppointments()
  await chatStore.getPatientChats(user.value!)

  loading.value = false
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Bienvenido, {{ user?.nombre }}</div>
          <div class="text-subtitle">Aquí tienes un resumen de tu cuenta</div>
        </div>
        <div class="row justify-evenly">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="section-header">
                  <div class="text-h6">Próximas citas</div>
                  <div class="text-subtitle">Consulta tus próximas citas</div>
                </div>

                <PreviaCita
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  :appointment="appointment"
                  @appointment:show="
                    $router.push({ name: 'appointment', params: { id: $event.id } })
                  "
                />

                <div v-if="appointments.length === 0" class="q-mt-md q-ml-md q-mb-md">
                  <span> No tienes citas programadas. </span>
                </div>
              </q-card-section>

              <q-card-actions v-if="appointments.length > 0" align="right">
                <q-btn
                  label="Ver todas mis citas"
                  flat
                  bordered
                  @click="$router.push({ name: 'appointments' })"
                />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="section-header">
                  <div class="text-h6">Últimos mensajes</div>
                  <div class="text-subtitle">Conversaciones con tus médicos</div>
                </div>

                <PreviaMensaje
                  v-for="chat in chats"
                  :key="chat.id"
                  :chat="chat"
                  :title="`${chat.doctor.user!.sexo === 'Mujer' ? 'Dra.' : 'Dr.'} ${chat.doctor.user!.nombre} ${chat.doctor.user!.apellidos}`"
                />

                <div v-if="chats.length === 0" class="q-mt-md q-ml-md q-mb-md">
                  <span> No tienes ningun chat abierto. </span>
                </div>
              </q-card-section>

              <q-card-actions v-if="chats.length > 0" align="right">
                <q-btn
                  label="Ver todos mis mensajes"
                  flat
                  bordered
                  @click="$router.push({ name: 'chats' })"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="q-pa-md">
      <div class="text-center q-pa-xl">
        <q-spinner size="3em" color="primary" />
        <div class="text-subtitle1 q-mt-md">Cargando...</div>
      </div>
    </div>
  </q-page>
</template>
