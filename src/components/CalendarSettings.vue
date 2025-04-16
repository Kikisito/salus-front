<script lang="ts" setup>
const calendarStartHour = defineModel('startHour', { required: true, type: Number })
const calendarEndHour = defineModel('endHour', { required: true, type: Number })
const rowHeight = defineModel('height', { required: true, type: Number })
</script>

<template>
  <div class="q-pa-md">
    <div class="text-subtitle2">Horas visibles</div>
    <div class="row q-mt-sm items-center">
      <span class="q-mr-sm">Desde:</span>
      <q-input
        v-model.number="calendarStartHour"
        type="number"
        dense
        min="0"
        max="23"
        style="width: 70px"
      />
      <span class="q-mx-sm">hasta:</span>
      <q-input
        v-model.number="calendarEndHour"
        type="number"
        dense
        min="1"
        max="24"
        style="width: 70px"
      />
    </div>

    <q-separator class="q-my-md" />

    <div class="text-subtitle2">Tamaño de filas</div>
    <div class="row q-mt-sm items-center">
      <span class="q-mr-sm">Altura en píxeles:</span>
      <q-input
        v-model.number="rowHeight"
        type="number"
        dense
        min="32"
        max="120"
        style="width: 70px"
      />
    </div>

    <div class="row q-mt-md">
      <q-btn label="Pequeño" flat dense size="sm" @click="rowHeight = 48" class="q-mr-xs" />
      <q-btn label="Normal" flat dense size="sm" @click="rowHeight = 64" class="q-mr-xs" />
      <q-btn label="Grande" flat dense size="sm" @click="rowHeight = 96" />
    </div>
  </div>
</template>
