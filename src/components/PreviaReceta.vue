<script lang="ts" setup>
import { HeFilledMedicines } from '@kalimahapps/vue-icons'

const props = defineProps(['receta'])
</script>

<template>
  <q-card v-ripple flat bordered class="cursor-pointer">
    <q-item>
      <q-item-section avatar>
        <HeFilledMedicines class="text-h4" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ props.receta.especialidad }}</q-item-label>
        <q-item-label caption>{{ props.receta.doctor }}</q-item-label>
        <q-item-label caption>{{ props.receta.fechas }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
