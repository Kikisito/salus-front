<script lang="ts" setup>
import type { ChatMessage } from 'src/interfaces/ChatMessage'

const messages = defineModel('messages', {
  type: Array as () => ChatMessage[],
  required: true,
})

defineProps({
  recipientType: {
    type: String,
    validator: (value: string) => ['PATIENT', 'DOCTOR'].includes(value),
    required: true,
  },
  chattingWith: {
    type: String,
    required: true,
  },
})

function showDateLabel(index: number): boolean {
  // En el primer mensaje siempre mostramos la fecha
  if (index === 0) return true

  // Si hay un mensaje anterior, comparamos las fechas de envío con el mensaje actual
  const currentMessage = messages.value[index]!
  const previousMessage = messages.value[index - 1]
  if (previousMessage) {
    const currentDate = new Date(currentMessage.createdAt).toDateString()
    const prevDate = new Date(previousMessage.createdAt).toDateString()
    return currentDate !== prevDate
  }

  return false
}

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
}
</script>

<template>
  <template v-for="(message, index) in messages" :key="index">
    <q-chat-message v-if="showDateLabel(index)" :label="formatDateLabel(message.createdAt)" />

    <q-chat-message
      class="q-mt-sm"
      :name="message.senderType === recipientType ? 'Yo' : chattingWith"
      :text="[message.content]"
      :stamp="
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      "
      :bg-color="message.senderType === recipientType ? 'green-1' : 'blue-1'"
      :sent="message.senderType === recipientType"
    />

    <!--<template v-if="message.files">
              <q-chip
                v-for="file in message.files"
                :key="file.name"
                clickable
                color="primary"
                text-color="white"
                icon="attach_file"
                @click="handleFile(file.name)"
              >
                <span>
                  Pulsa para abrir el fichero <b>{{ file.name }}</b>
                </span>
              </q-chip>
            </template>-->
  </template>
</template>
