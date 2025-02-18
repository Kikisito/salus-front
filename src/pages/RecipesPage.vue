<script setup lang="ts">
import PreviaReceta from 'src/components/PreviaReceta.vue'

const recetas = [
  {
    id: 1,
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha_receta: new Date('2025-02-16'),
    fecha_inicio: new Date('2025-02-16'),
    fecha_fin: new Date('2025-03-16'),
    medicamentos: [
      {
        nombre: 'Paracetamol',
        pauta: '1 comprimido cada 8 horas',
        fecha_fin: new Date('2025-03-16'),
      },
      {
        nombre: 'Ibuprofeno',
        pauta: '1 comprimido cada 12 horas',
        fecha_fin: new Date('2025-03-01'),
      },
      {
        nombre: 'Omeprazol',
        pauta: '1 comprimido cada 24 horas',
        fecha_fin: new Date('2025-02-16'),
      },
    ],
  },
  {
    id: 2,
    especialidad: 'Cardiología',
    doctor: 'Dra. María Pérez',
    fecha_receta: new Date('2025-02-10'),
    fecha_inicio: new Date('2025-02-10'),
    fecha_fin: new Date('2025-02-16'),
    medicamentos: [
      {
        nombre: 'Aspirina',
        pauta: '1 comprimido cada 24 horas',
        fecha_fin: new Date('2025-02-16'),
      },
      {
        nombre: 'Enalapril',
        pauta: '1 comprimido cada 12 horas',
        fecha_fin: new Date('2025-02-01'),
      },
    ],
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
