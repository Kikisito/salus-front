<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Chat } from 'src/interfaces/Chat'
import type { ChatMessage } from 'src/interfaces/ChatMessage'
import { useChatStore } from 'src/stores/ChatStore'
import { useUserStore } from 'src/stores/UserStore'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/AuthStore'
import ChatComponent from 'src/components/ChatComponent.vue'
import { Notify } from 'quasar'
import { connectWebSocket } from 'src/services/websocket'
import type { Client } from '@stomp/stompjs'

const route = useRoute()
const router = useRouter()

const userId = Number(route.params.id)

const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

const userStore = useUserStore()
const { medicalProfile } = storeToRefs(userStore)

const chatStore = useChatStore()
const activeChat = ref<Chat | null>(null)
const chatWebSocket = ref<Client | null>(null)

const messageInput = ref<string>('')
const messageInputLoading = ref<boolean>(false)
const messages = ref<ChatMessage[]>([])

const scrollAreaRef = ref()

function scrollToBottom() {
  nextTick(() => {
    const scrollEl = scrollAreaRef.value?.getScrollTarget?.()
    if (scrollEl) {
      scrollAreaRef.value.setScrollPosition('vertical', scrollEl.scrollHeight)
    }
  })
}

async function sendMessage() {
  if (!messageInput.value.trim()) return

  messageInputLoading.value = true

  const newMessage: ChatMessage = {
    id: -1,
    chatId: activeChat.value!.id,
    senderType: 'DOCTOR',
    content: messageInput.value,
    createdAt: new Date().toString(),
    read: false,
  }

  const response = await chatStore.sendMessage(userId, medicalProfile.value.id, newMessage.content)
  if (response.success) {
    messages.value.push(newMessage)
    messageInput.value = ''
    scrollToBottom()
  } else {
    console.error('Error al enviar el mensaje')
    Notify.create({
      type: 'negative',
      message: 'Error al enviar el mensaje',
    })
  }

  messageInputLoading.value = false
}

onMounted(async () => {
  if (medicalProfile.value) {
    // Cargamos el chat activo
    const chatInfoResponse = await chatStore.getChatInfo(userId, medicalProfile.value.id)
    if (chatInfoResponse.success) {
      activeChat.value = chatInfoResponse.data
    } else {
      console.error('No se ha podido obtener el chat')
      Notify.create({
        type: 'negative',
        message: chatInfoResponse.error,
      })
      router.push({ name: 'professional-chats' })
    }

    // Cargamos los mensajes del chat
    const messagesResponse = await chatStore.getChatMessages(userId, medicalProfile.value.id)

    if (messagesResponse.success) {
      messages.value = messagesResponse.data
      scrollToBottom()
    } else {
      console.error('No se ha podido obtener el chat')
    }
  } else {
    console.error('No se ha podido obtener el usuario')
  }

  // Nos conectamos al WebSocket para recibir mensajes en tiempo real
  chatWebSocket.value = await connectWebSocket(token.value!, (data: ChatMessage) => {
    if (data.chatId === activeChat.value?.id) {
      messages.value.push(data)
      scrollToBottom()
    }
  })
})

// Desconectamos el WebSocket al salir de la página
onUnmounted(async () => {
  if (chatWebSocket.value) {
    chatWebSocket.value.deactivate()
  }
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div>
            <div class="text-h6">Mensajes</div>
            <div class="text-subtitle">
              Conversación con {{ activeChat?.patient.nombre }} {{ activeChat?.patient.apellidos }}
            </div>
          </div>
        </div>

        <q-scroll-area ref="scrollAreaRef">
          <ChatComponent
            v-model:messages="messages"
            recipient-type="DOCTOR"
            :chatting-with="`${activeChat?.patient.nombre} ${activeChat?.patient.apellidos}`"
          />
        </q-scroll-area>

        <q-separator />

        <q-input
          v-model="messageInput"
          placeholder="Escribe un mensaje..."
          class="q-mt-sm"
          :loading="messageInputLoading"
          @keyup.enter="sendMessage"
          outlined
          dense
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage()" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header .q-btn {
  margin-right: 10px;
}

@media (max-width: 320px) {
  .q-scrollarea {
    height: calc(100vh - 200px);
  }
}

@media (max-width: 600px) {
  .q-scrollarea {
    height: calc(100vh - 190px);
  }
}

@media (min-width: 600px) {
  .q-scrollarea {
    height: calc(100vh - 220px);
  }
}
</style>
