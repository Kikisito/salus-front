<script setup lang="ts">
import PreviaPrueba from 'src/components/PreviaPrueba.vue'

const pruebas = [
  {
    id: 1,
    type: 'Prueba',
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha: '16 de febrero de 2025, 10:00',
    texto: 'El paciente presenta una leve alergia al polen.',
  },
  {
    id: 2,
    type: 'Analítica',
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha: '17 de febrero de 2025, 10:00',
    texto: 'El paciente presenta una leve alergia a los gatos.',
  },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Pruebas y Analíticas</div>
          <div class="text-subtitle">Visualiza los informes de tus pruebas médicas</div>
        </div>
        <PreviaPrueba v-for="(prueba, index) in pruebas" :key="index" :prueba="prueba" />
      </div>
    </div>
  </q-page>
</template>
