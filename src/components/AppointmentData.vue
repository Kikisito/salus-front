<script lang="ts" setup>
import { HeFilledCalendar } from '@kalimahapps/vue-icons'
import { formattedStatus } from 'src/helpers/formattedAppointmentStatus'
import type { Appointment } from 'src/interfaces/Appointment'
import type { PropType } from 'vue'

defineProps({
  appointment: {
    type: Object as PropType<Partial<Appointment>>,
    required: true,
  },
  editableStatus: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['appointment:set-status'])
</script>

<template>
  <q-card flat bordered>
    <q-card-section v-if="appointment && appointment.slot">
      <div class="row items-center">
        <HeFilledCalendar class="q-mr-sm" />
        <div class="text-h6">Detalles de la cita</div>
      </div>
      <q-separator class="q-my-sm" />

      <q-item>
        <q-item-section>
          <q-item-label>Fecha y hora</q-item-label>
          <q-item-label caption>
            {{ appointment.slot.date }} {{ appointment.slot.startTime }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Especialidad</q-item-label>
          <q-item-label caption>
            {{ appointment.slot.specialty.name }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Ubicación</q-item-label>
          <q-item-label caption>
            {{ appointment.slot.room.name }} ({{ appointment.slot.room.medicalCenter.name }})
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Motivo de la consulta</q-item-label>
          <q-item-label caption>{{ appointment.reason }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label>Estado</q-item-label>
          <q-item-label caption>{{ formattedStatus(appointment.status || 'Error') }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn-dropdown
            v-if="editableStatus"
            color="primary"
            label="Modificar estado"
            icon="edit"
            size="sm"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="
                  $emit('appointment:set-status', {
                    appointment: appointment,
                    status: 'PENDING',
                  })
                "
              >
                <q-item-section avatar>
                  <q-icon name="pending" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Pendiente</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="
                  $emit('appointment:set-status', {
                    appointment: appointment,
                    status: 'COMPLETED',
                  })
                "
              >
                <q-item-section avatar>
                  <q-icon name="check_circle" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Finalizada</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="
                  $emit('appointment:set-status', {
                    appointment: appointment,
                    status: 'ABSENT',
                  })
                "
              >
                <q-item-section avatar>
                  <q-icon name="cancel" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Ausente</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section v-else>
      <div class="text-center q-pa-md text-grey">No hay detalles de la cita disponibles</div>
    </q-card-section>
  </q-card>
</template>
