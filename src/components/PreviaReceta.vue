<script lang="ts" setup>
import { formattedDate } from 'src/helpers/formattedDate'
import { computed, ref } from 'vue'

import type { Medication } from 'src/interfaces/Medication'
import type { Prescription } from 'src/interfaces/Prescription'
import type { PropType } from 'vue'
import { useNotificationStore } from 'src/stores/NotificationStore'
import { storeToRefs } from 'pinia'
import { Dialog, Loading, Notify } from 'quasar'

const notificationStore = useNotificationStore()
const { pendingNotifications } = storeToRefs(notificationStore)

const props = defineProps({
  prescription: {
    type: Object as PropType<Prescription>,
    required: true,
  },
})

defineEmits(['prescription:download'])

const expanded = ref<boolean>(false)

const fechaInicioReceta = computed(() => {
  if (!props.prescription.medications || props.prescription.medications.length === 0) {
    return null
  }

  return new Date(
    Math.min(...props.prescription.medications.map((med) => new Date(med.startDate).getTime())),
  )
})

const fechaFinReceta = computed(() => {
  if (!props.prescription.medications || props.prescription.medications.length === 0) {
    return null
  }

  return new Date(
    Math.max(...props.prescription.medications.map((med) => new Date(med.endDate).getTime())),
  )
})

const estadoReceta = computed(() => {
  const today = new Date()
  return today <= fechaFinReceta.value! ? 'Activa' : 'Caducada'
})

function isMedicationActive(medication: Medication) {
  const today = new Date()
  const endDate = new Date(medication.endDate)
  return today <= endDate
}

const notificationsEnabled = computed(() => {
  return pendingNotifications.value.some((notification) => {
    const { prescriptionId } = notification.extra
    return prescriptionId === props.prescription.id
  })
})

async function toggleNotification() {
  try {
    if (notificationsEnabled.value) {
      Loading.show({
        message: 'Desactivando recordatorio...',
      })

      await notificationStore.cancelPrescriptionNotifications(props.prescription)

      Notify.create({
        type: 'positive',
        message: 'Recordatorio desactivado',
      })
    } else {
      Dialog.create({
        title: 'Activar recordatorio',
        message: 'Selecciona la hora en la que tomarás el primer medicamento',
        prompt: {
          model: '',
          type: 'time',
          rules: [
            (val) => !!val || 'Debes seleccionar una hora',
            (val) => {
              const [hours, minutes] = val.split(':').map(Number)
              return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60
                ? true
                : 'Hora inválida'
            },
          ],
        },
        cancel: true,
        persistent: true,
      }).onOk(async (time) => {
        Loading.show({
          message: 'Activando recordatorio...',
        })

        const selectedTime = new Date()
        const [hours, minutes] = time.split(':').map(Number)
        selectedTime.setHours(hours, minutes, 0)

        // En caso de que ya estén activos, cancelamos los recordatorios existentes y programamos los nuevos
        await notificationStore.cancelPrescriptionNotifications(props.prescription)
        await notificationStore.schedulePrescriptionNotification(props.prescription, selectedTime)

        Notify.create({
          type: 'positive',
          message: 'Recordatorio activado',
        })

        Loading.hide()
      })
    }
  } finally {
    Loading.hide()
  }
}
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon
            :class="estadoReceta === 'Activa' ? 'text-green' : 'text-red'"
            name="medication"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ props.prescription.specialty.name }}</q-item-label>
          <q-item-label caption>
            {{ props.prescription.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
            {{ props.prescription.doctor.user.nombre }}
            {{ props.prescription.doctor.user.apellidos }}
          </q-item-label>
          <q-item-label caption>
            {{ fechaInicioReceta ? formattedDate(fechaInicioReceta) : 'Sin fecha' }} hasta
            {{ fechaFinReceta ? formattedDate(fechaFinReceta) : 'Sin fecha' }}
          </q-item-label>
          <q-item-label caption :class="estadoReceta === 'Activa' ? 'text-green' : 'text-red'"
            >Estado: {{ estadoReceta }}</q-item-label
          >
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Medicamentos:</div>
        <q-list bordered>
          <template v-for="(medication, index) in props.prescription.medications" :key="index">
            <q-item :class="!isMedicationActive(medication) ? 'bg-red-1' : ''">
              <q-item-section>
                <q-item-label :class="!isMedicationActive(medication) ? 'text-strike' : ''">
                  {{ medication.name }}
                </q-item-label>
                <q-item-label caption>Dosis: {{ medication.dosage }}</q-item-label>
                <q-item-label caption>
                  Frecuencia: Cada {{ medication.frequency }} horas
                </q-item-label>
                <q-item-label v-if="medication.instructions" caption>
                  Instrucciones: {{ medication.instructions }}
                </q-item-label>
                <q-item-label caption>
                  Hasta el {{ formattedDate(new Date(medication.endDate)) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator inset v-if="index < props.prescription.medications.length - 1" />
          </template>
        </q-list>

        <q-card-actions align="center">
          <q-btn
            class="q-mt-sm"
            label="Descargar receta"
            color="primary"
            icon="download"
            @click="$emit('prescription:download', props.prescription)"
          />

          <q-btn
            class="q-mt-sm capacitor-only"
            :label="notificationsEnabled ? 'Desactivar recordatorio' : 'Activar recordatorio'"
            :color="notificationsEnabled ? 'red' : 'green'"
            :icon="notificationsEnabled ? 'visibility_off' : 'visibility'"
            @click="toggleNotification()"
          />
        </q-card-actions>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<style scoped>
.q-list {
  border-radius: 0.25rem;
  background-color: white;
}

.q-list:hover {
  transition: background-color 0.5s;
  background-color: #f5f5f5;
}
</style>
