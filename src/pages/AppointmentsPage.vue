<script lang="ts" setup>
import { HeFilledAllergies, HeFilledRunning } from '@kalimahapps/vue-icons'
import AppointmentModal from 'src/components/AppointmentModal.vue'
import PreviaCita from 'src/components/PreviaCita.vue'
import { h, ref } from 'vue'

const showModal = ref(false)

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
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Tus próximas citas</div>
          <div class="text-subtitle">Consulta tus próximas citas</div>
        </div>

        <PreviaCita v-for="cita in citas" :key="cita.id" :cita="cita" />

        <div class="text-caption text-center">
          <q-btn
            color="primary"
            flat
            label="Ver citas antiguas"
            @click="console.log('Pendiente. todo')"
          />
        </div>
      </div>
    </div>

    <AppointmentModal v-model:show="showModal" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" class="bg-primary text-white" @click="showModal = true" />
    </q-page-sticky>
  </q-page>
</template>
