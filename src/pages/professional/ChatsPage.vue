<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import PreviaMensaje from 'src/components/PreviaMensaje.vue'
import type { Chat } from 'src/interfaces/Chat'
import { useChatStore } from 'src/stores/ChatStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const chatStore = useChatStore()
const chats = ref<Chat[]>([])

onMounted(async () => {
  if (medicalProfile.value) {
    const response = await chatStore.getDoctorChats(medicalProfile.value)
    if (response.success) {
      chats.value = response.data
    } else {
      console.error('Error al cargar los chats')
      Notify.create({
        type: 'negative',
        message: 'No se han podido cargar los chats',
      })
    }
  } else {
    console.error('No se pudo obtener el ID del usuario')
    Notify.create({
      type: 'negative',
      message: 'No se han podido cargar los chats',
    })
  }
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Mensajes</div>
          <div class="text-subtitle">Consulta las conversaciones con tus pacientes</div>
        </div>

        <PreviaMensaje
          v-for="chat in chats"
          :key="chat.id"
          :chat="chat"
          :title="`${chat.patient.nombre} ${chat.patient.apellidos}`"
          @chat:click="
            $router.push({ name: 'professional-chat', params: { id: $event.patient.id } })
          "
        />

        <div v-if="chats.length === 0" class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-body1">No tienes ningún chat abierto con tus pacientes.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
