<script lang="ts" setup>
const props = defineProps(['cita'])
</script>

<template>
  <q-card
    v-ripple
    flat
    bordered
    class="cursor-pointer"
    @click="$router.push({ name: 'appointment', params: { id: props.cita.id } })"
  >
    <q-item>
      <q-item-section>
        <q-item-label>{{ props.cita.especialidad }}</q-item-label>
        <q-item-label caption>{{ props.cita.doctor }}</q-item-label>
        <q-item-label caption>
          {{ props.cita.fecha }} a las <b>{{ props.cita.hora }}</b>
        </q-item-label>
      </q-item-section>

      <q-item-section avatar>
        <component :is="props.cita.icon" class="text-h3" />
      </q-item-section>
    </q-item>
  </q-card>
</template>
