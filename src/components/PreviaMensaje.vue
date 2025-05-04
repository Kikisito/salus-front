<script lang="ts" setup>
import type { Chat } from 'src/interfaces/Chat'
import type { PropType } from 'vue'

const props = defineProps({
  chat: {
    type: Object as PropType<Chat>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

defineEmits(['chat:click'])
</script>

<template>
  <q-card
    v-ripple
    flat
    bordered
    class="cursor-pointer q-card-selectable"
    @click="$emit('chat:click', props.chat)"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="person" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ title }}
        </q-item-label>
        <q-item-label v-if="props.chat.lastMessage" caption>
          <b>{{
            new Date(props.chat.lastMessage.createdAt).toLocaleString(undefined, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }}</b>
          {{ props.chat.lastMessage.content }}
        </q-item-label>
        <q-item-label v-else caption> Este chat se encuentra vacío </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
