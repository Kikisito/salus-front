<script lang="ts" setup>
import type { Appointment } from 'src/interfaces/Appointment'
import { computed } from 'vue'

const props = defineProps({
  appointment: {
    type: Object as () => Appointment,
    required: true,
  },
})

defineEmits(['appointment:show'])

// Formatear fecha para mejor lectura
const formattedDate = computed(() => {
  const date = new Date(props.appointment.slot.date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const time = props.appointment.slot.startTime.slice(0, 5)
  return { date, time }
})
</script>

<template>
  <q-card
    v-ripple
    flat
    bordered
    class="cursor-pointer q-card-selectable appointment-card"
    tabindex="0"
    role="button"
    aria-label="Ver detalles de cita"
    @click="$emit('appointment:show', props.appointment)"
    @keyup.enter="$emit('appointment:show', props.appointment)"
  >
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-medium text-h6">
          {{ props.appointment.slot.specialty.name }}
        </q-item-label>

        <q-item-label caption class="text-subtitle1 q-mt-sm">
          <span class="text-weight-medium">Médico:</span>
          {{ props.appointment.slot.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
          {{ props.appointment.slot.doctor.user.nombre }}
        </q-item-label>

        <q-item-label caption class="text-subtitle1 q-mt-sm">
          <div class="row items-center">
            <q-icon name="event" size="1.2em" class="q-mr-xs text-primary" />
            <span class="text-weight-medium">Fecha:</span>
            <b class="q-ml-xs">{{ formattedDate.date }}</b>
          </div>
          <div class="row items-center q-mt-xs">
            <q-icon name="schedule" size="1.2em" class="q-mr-xs text-primary" />
            <span class="text-weight-medium">Hora:</span>
            <b class="q-ml-xs">{{ formattedDate.time }}</b>
          </div>
        </q-item-label>
      </q-item-section>

      <q-item-section avatar>
        <q-icon name="event_available" size="3em" color="primary" class="q-mr-sm" />
      </q-item-section>
    </q-item>

    <div class="text-center text-caption q-pb-xs text-grey">
      Pulsa para ver los detalles de la cita
    </div>
  </q-card>
</template>

<style scoped>
.appointment-card {
  transition: all 0.3s;
}

.appointment-card:focus {
  outline: 2px solid #1976d2;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.6);
}

.appointment-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
