<script setup lang="ts">
import PreviaInforme from 'src/components/PreviaInforme.vue'

const informes = [
  {
    id: 1,
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha: '16 de febrero de 2025, 10:00',
    texto: 'El paciente presenta una leve alergia al polen.',
  },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Informes</div>
          <div class="text-subtitle">Visualiza tus informes médicos</div>
        </div>
        <PreviaInforme v-for="informe in informes" :key="informe.id" :informe="informe" />
      </div>
    </div>
  </q-page>
</template>
