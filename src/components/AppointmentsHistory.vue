<script lang="ts" setup>
import type { Appointment } from 'src/interfaces/Appointment'
import type { PropType } from 'vue'

defineProps({
  appointments: {
    type: Array as PropType<Appointment[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['appointment:show'])
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center justify-between">
        <div>
          <q-icon name="event" class="q-mr-sm" />
          <span class="text-h6">Historial de citas</span>
        </div>
      </div>
      <q-separator class="q-my-sm" />

      <div v-if="loading" class="text-center q-py-md">
        <q-spinner size="2em" color="primary" />
        <div class="q-mt-sm">Cargando citas...</div>
      </div>

      <div v-else-if="appointments.length === 0" class="text-center q-py-md text-grey">
        <q-icon name="event_busy" size="3em" />
        <p>No hay citas registradas para este paciente</p>
      </div>

      <q-list v-else separator>
        <q-item
          v-for="appointment in appointments"
          :key="appointment.id"
          clickable
          @click="$emit('appointment:show', appointment)"
        >
          <q-item-section>
            <q-item-label>
              {{ appointment.slot.specialty.name }}
            </q-item-label>
            <q-item-label caption>
              <p class="q-mb-none">
                Dr./Dra. {{ appointment.slot.doctor.user.nombre }}
                {{ appointment.slot.doctor.user.apellidos }}
              </p>

              <p class="q-mb-none">
                El {{ appointment.slot.date }} a las {{ appointment.slot.startTime }}
              </p>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="visibility" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
