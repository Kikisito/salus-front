<script lang="ts" setup>
import { HeFilledRegisterBook } from '@kalimahapps/vue-icons'

const props = defineProps(['informe'])
</script>

<template>
  <q-card v-ripple flat bordered class="cursor-pointer">
    <q-item>
      <q-item-section avatar>
        <HeFilledRegisterBook class="text-h4" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ props.informe.especialidad }}</q-item-label>
        <q-item-label caption>{{ props.informe.doctor }}</q-item-label>
        <q-item-label caption>{{ props.informe.fecha }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
