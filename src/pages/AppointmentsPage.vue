<script lang="ts" setup>
import { HeFilledAllergies, HeFilledRunning } from '@kalimahapps/vue-icons'
import PreviaCita from 'src/components/PreviaCita.vue'
import { h } from 'vue'

const citas = [
  {
    id: 1,
    especialidad: 'Alergología',
    doctor: 'Dr. María Hernández',
    fecha: '10 de diciembre de 2024',
    hora: '13:00',
    icon: h(HeFilledAllergies),
  },
  {
    id: 2,
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha: 'Hoy',
    hora: '9:16',
    icon: h(HeFilledRunning),
  },
]
</script>

<template>
  <q-page padding>
    <div class="section-header">
      <div class="text-h6">Tus próximas citas</div>
    </div>

    <PreviaCita v-for="cita in citas" :key="cita.id" :cita="cita" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" style="background-color: #f1f4f8; color: #65558f" />
    </q-page-sticky>
  </q-page>
</template>
