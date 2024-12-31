<script lang="ts" setup>
const props = defineProps(['mensaje'])
</script>

<template>
  <q-card v-ripple flat bordered class="cursor-pointer">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="props.mensaje.avatar" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ props.mensaje.doctor }}</q-item-label>
        <q-item-label caption>{{ props.mensaje.especialidad }}</q-item-label>
        <q-item-label caption>
          <b>{{ props.mensaje.hora }}</b> {{ props.mensaje.mensaje }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style lang="css" scoped>
.q-card {
  background-color: #f1f4f8;
  margin: 0.5rem;
}

.q-card:hover {
  transition: background-color 0.3s;
  background-color: #e4e7eb;
}
</style>
