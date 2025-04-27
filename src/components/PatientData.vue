<script lang="ts" setup>
import type { User } from 'src/interfaces/User'
import type { PropType } from 'vue'

defineProps({
  patient: {
    type: Object as PropType<Partial<User>>,
    required: true,
  },
})
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center">
        <q-icon name="info" class="q-mr-sm" />
        <div class="text-h6">Información del paciente</div>
      </div>
      <q-separator class="q-my-sm" />

      <q-item>
        <q-item-section>
          <q-item-label>Nombre</q-item-label>
          <q-item-label caption>{{ patient.nombre }} {{ patient.apellidos }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Documento de identidad</q-item-label>
          <q-item-label caption>{{ patient.nif }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Edad</q-item-label>
          <q-item-label caption>
            {{ new Date().getFullYear() - new Date(patient.fechaNacimiento!).getFullYear() }}
            años</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Email</q-item-label>
          <q-item-label caption>{{ patient.email }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Teléfono</q-item-label>
          <q-item-label caption>{{ patient.telefono }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
