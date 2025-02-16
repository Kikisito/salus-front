<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  text: string[]
  sender: string
  avatar?: string
  stamp: string
  bgColor?: string
  files?: Array<{ name: string }>
  sent?: boolean
}

const mensaje = ref('')
const messages = ref<Message[]>([
  {
    id: 1,
    text: [
      'Buenas, estoy preparando una serie de ejercicios para que realices tras la sesión de fisioterapia que también te he mandado. Adjunto cita. También la tienes disponible en el apartado citas de la app.',
    ],
    sender: 'Dr. Juan Martínez',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genfe80258a028351a2c3d02625c5ee034a.jpg',
    stamp: '13:15',
    bgColor: 'blue-1',
    files: [{ name: 'cita_fisio.pdf' }],
    sent: false,
  },
  {
    id: 2,
    text: [
      'Buenos días, te adjunto un pdf con ejercicios que debes realizar estos días. Cualquier cosa, contáctame.',
    ],
    sender: 'Dr. Juan Martínez',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genfe80258a028351a2c3d02625c5ee034a.jpg',
    stamp: 'ayer',
    bgColor: 'blue-1',
    files: [{ name: 'ejercicios.pdf' }, { name: 'complementario.pdf' }],
    sent: false,
  },
])

const sendMessage = () => {
  if (!mensaje.value.trim()) return

  const newMessage = {
    id: messages.value.length + 1,
    text: [mensaje.value],
    sender: 'Yo',
    stamp: new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    bgColor: 'green-1',
    sent: true,
  }

  messages.value.push(newMessage)
  mensaje.value = ''
}

const handleFile = (fileName: string) => {
  console.log('Abriendo archivo:', fileName)
}
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div>
            <div class="text-h6">Mensajes</div>
            <div class="text-subtitle">Dr. Juan Martínez (Fisiología)</div>
          </div>
        </div>

        <q-scroll-area>
          <q-chat-message label="ayer" />

          <template v-for="message in messages" :key="message.id">
            <q-chat-message
              class="q-mt-sm"
              :name="message.sender"
              :avatar="message.avatar"
              :text="message.text"
              :stamp="message.stamp"
              :bg-color="message.bgColor"
              :sent="message.sent"
            />

            <template v-if="message.files">
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
            </template>
          </template>
        </q-scroll-area>

        <q-separator />

        <q-input
          outlined
          v-model="mensaje"
          placeholder="Escribe un mensaje..."
          dense
          class="q-mt-sm"
          @keyup.enter="sendMessage"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" />
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
