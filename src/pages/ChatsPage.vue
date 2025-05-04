<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import PreviaMensaje from 'src/components/PreviaMensaje.vue'
import { useChatStore } from 'src/stores/ChatStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

const loading = ref(true)

onMounted(async () => {
  if (user.value) {
    await chatStore.getPatientChats(user.value)
  } else {
    console.error('No se pudo obtener el ID del usuario')
    Notify.create({
      type: 'negative',
      message: 'No se han podido cargar los chats',
    })
  }

  loading.value = false
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Mensajes</div>
          <div class="text-subtitle">Consulta los mensajes de tus médicos</div>
        </div>

        <PreviaMensaje
          v-for="chat in chats"
          :key="chat.id"
          :chat="chat"
          :title="`${chat.doctor.user!.sexo === 'Mujer' ? 'Dra.' : 'Dr.'} ${chat.doctor.user!.nombre} ${chat.doctor.user!.apellidos}`"
          @chat:click="$router.push({ name: 'chat', params: { id: $event.doctor.id } })"
        />

        <div v-if="chats.length === 0" class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-body1">No tienes ningún chat abierto con tus médicos.</div>
            </q-card-section>
          </q-card>
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
