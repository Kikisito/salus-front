<script lang="ts" setup>
import { formattedDate } from 'src/helpers/formattedDate'
import { computed, ref } from 'vue'

import type { Medication } from 'src/interfaces/Medication'
import type { Prescription } from 'src/interfaces/Prescription'
import type { PropType } from 'vue'

const props = defineProps({
  prescription: {
    type: Object as PropType<Prescription>,
    required: true,
  },
})

defineEmits(['prescription:download'])

const expanded = ref(false)

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
                <q-item-label caption>Frecuencia: {{ medication.frequency }}</q-item-label>
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
