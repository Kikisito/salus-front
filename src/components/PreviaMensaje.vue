<script lang="ts" setup>
const props = defineProps(['mensaje'])
</script>

<template>
  <q-card
    v-ripple
    flat
    bordered
    class="cursor-pointer q-card-selectable"
    @click="$router.push({ name: 'chat', params: { id: props.mensaje.id } })"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="props.mensaje.avatar" />
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
