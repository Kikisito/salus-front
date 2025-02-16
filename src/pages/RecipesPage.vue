<script setup lang="ts">
import PreviaReceta from 'src/components/PreviaReceta.vue'

const recetas = [
  {
    id: 1,
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha_receta: '16 de febrero de 2025',
    fechas: '16 de febrero de 2025 hasta 16 de marzo de 2025',
  },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Recetas</div>
          <div class="text-subtitle">Visualiza todas tus recetas</div>
        </div>
        <PreviaReceta v-for="receta in recetas" :key="receta.id" :receta="receta" />
      </div>
    </div>
  </q-page>
</template>
