<script setup lang="ts">
import PreviaMensaje from 'src/components/PreviaMensaje.vue'

const mensajes = [
  {
    id: 1,
    doctor: 'Dr. Juan Martínez',
    especialidad: 'Fisiología',
    hora: '9:16',
    mensaje: '¡Hola! ¿Cómo te encuentras?',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genfe80258a028351a2c3d02625c5ee034a.jpg',
  },
  {
    id: 2,
    doctor: 'Dr. María Hernández',
    especialidad: 'Alergología',
    hora: 'Ayer',
    mensaje: '¡Hola! ¿Cómo te encuentras?',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genb334052d7d54966fb8382d481530fb2d.jpg',
  },
  {
    id: 3,
    doctor: 'Dr. Laura Méndez',
    especialidad: 'Neurología',
    hora: '15:45',
    mensaje: 'Recuerda hacer tus ejercicios de relajación.',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-gen8ebdf8f640c42fe6b3484d6947f49894.jpg',
  },
  {
    id: 4,
    doctor: 'Dr. Jorge Ramírez',
    especialidad: 'Pediatría',
    hora: '8:00',
    mensaje: 'La fiebre ha bajado, sigue con los cuidados.',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-gen3db975f6be246415b0ef820d8446b5bc.jpg',
  },
  {
    id: 5,
    doctor: 'Dr. Sofía Herrera',
    especialidad: 'Endocrinología',
    hora: '12:20',
    mensaje: 'Es importante mantener una dieta balanceada.',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-gen96bbece13ef778e87f8b21f1705fb05c.jpg',
  },
  {
    id: 6,
    doctor: 'Dr. Ricardo Fernández',
    especialidad: 'Oftalmología',
    hora: '17:50',
    mensaje: 'No olvides usar tus gotas para los ojos.',
    avatar:
      'https://this-person-does-not-exist.com/img/avatar-genbb73dfb850c4f5530587cdf739c711b9.jpg',
  },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Mensajes</div>
          <div class="text-subtitle">Consulta los mensajes de tus médicos</div>
        </div>
        <PreviaMensaje v-for="mensaje in mensajes" :key="mensaje.id" :mensaje="mensaje" />
      </div>
    </div>
  </q-page>
</template>
