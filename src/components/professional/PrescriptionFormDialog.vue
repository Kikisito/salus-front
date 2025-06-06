<script lang="ts" setup>
import { Notify, useDialogPluginComponent } from 'quasar'

import { ref, type PropType } from 'vue'
import type { Prescription } from 'src/interfaces/Prescription'
import type { Medication } from 'src/interfaces/Medication'
import type { Specialty } from 'src/interfaces/Specialty'
import dateToApiDate from 'src/helpers/dateToApiDate'

const props = defineProps({
  prescription: {
    type: Object as PropType<Prescription>,
    default: null,
  },
  specialties: {
    type: Array as PropType<Specialty[]>,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const readonly = ref(props.readonly)
const specialtyInput = ref()

// Modelo del formulario
const prescription = ref<Partial<Prescription>>(props.prescription || {})

// Si no hay medicamentos en la receta, inicializamos como un array vacío
if (!prescription.value.medications) {
  prescription.value.medications = []
}

// Medicamento auxiliar para agregar a la receta local
const newMedication = ref<Partial<Medication>>({
  startDate: dateToApiDate(new Date()),
})

// Añadir un medicamento a la receta
function addMedication() {
  // Verificar si ya existe un medicamento con el mismo nombre
  const duplicate = prescription.value.medications?.some(
    (med) => med.name === newMedication.value.name,
  )

  if (duplicate) {
    Notify.create({
      type: 'negative',
      message: 'Ya existe un medicamento con ese nombre en la receta',
    })
    return
  }

  prescription.value.medications = [
    ...(prescription.value.medications || []),
    { ...newMedication.value } as Medication,
  ]

  // Resetear formulario de medicamentos
  newMedication.value = {
    startDate: dateToApiDate(new Date()),
  }
}

// Eliminar un medicamento de la receta
function removeMedication(index: number) {
  prescription.value.medications?.splice(index, 1)
}

async function submitPrescription() {
  // Validamos el campo de especialidad
  if (specialtyInput.value) {
    const specialty = specialtyInput.value.validate()
    if (!specialty) {
      Notify.create({
        type: 'negative',
        message: 'La especialidad es obligatoria',
      })
      return
    }
  }

  onDialogOK(prescription.value)
}
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 800px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="medication" />
        </q-avatar>

        <q-toolbar-title>Receta médica</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-md">Medicamentos</div>

        <!-- Lista de medicamentos añadidos -->
        <q-list
          bordered
          separator
          class="rounded-borders q-mb-md"
          v-if="prescription.medications?.length"
        >
          <q-item v-for="(med, index) in prescription.medications" :key="index">
            <q-item-section>
              <q-item-label>{{ med.name }} - {{ med.dosage }}</q-item-label>
              <q-item-label caption>
                Cada {{ med.frequency }} horas | {{ med.startDate }} a {{ med.endDate }}
              </q-item-label>
              <q-item-label caption v-if="med.instructions">
                Instrucciones: {{ med.instructions }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="!readonly">
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="removeMedication(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-grey text-center q-py-md" v-else>
          No hay medicamentos añadidos a esta receta
        </div>

        <!-- Formulario para añadir medicamentos -->
        <div v-if="!readonly" class="q-mb-lg">
          <div class="text-subtitle2 q-mb-sm">Añadir medicamento</div>

          <q-form @submit.prevent="addMedication()">
            <div class="row q-col-gutter-md">
              <!-- Nombre del medicamento -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newMedication.name"
                  label="Nombre del medicamento"
                  :rules="[(val) => !!val || 'El nombre es obligatorio']"
                  filled
                />
              </div>

              <!-- Dosificación -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newMedication.dosage"
                  label="Dosificación"
                  :rules="[(val) => !!val || 'La dosificación es obligatoria']"
                  hint="Ej: 1 comprimido de 500mg"
                  filled
                />
              </div>

              <!-- Frecuencia -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="newMedication.frequency"
                  label="Frecuencia"
                  :rules="[
                    (val) => !!val || 'La frecuencia es obligatoria',
                    (val) =>
                      /^\d+(\.\d{1,2})?$/.test(val) ||
                      'Solo se permiten valores numéricos con hasta 2 decimales',
                  ]"
                  hint='Ejemplos: "8" serán 8 horas; "3,5" serán 3 horas y 30 minutos'
                  filled
                  type="number"
                  min="1"
                  step="0.25"
                />
              </div>

              <!-- Fecha inicio -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="newMedication.startDate"
                  label="Fecha de inicio"
                  :rules="[(val) => !!val || 'La fecha de inicio es obligatoria']"
                  filled
                  type="date"
                />
              </div>

              <!-- Fecha fin -->
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="newMedication.endDate"
                  label="Fecha de fin"
                  filled
                  type="date"
                  :rules="[
                    (val) =>
                      (newMedication.startDate &&
                        new Date(val) >= new Date(newMedication.startDate)) ||
                      'La fecha fin debe ser posterior a la fecha inicio',
                  ]"
                />
              </div>

              <!-- Instrucciones -->
              <div class="col-12">
                <q-input
                  v-model="newMedication.instructions"
                  label="Instrucciones"
                  filled
                  type="textarea"
                  hint="Instrucciones adicionales (opcional)"
                />
              </div>

              <div class="col-12">
                <q-btn
                  type="submit"
                  label="Añadir medicamento"
                  icon="add"
                  color="primary"
                  :disable="
                    !newMedication.name ||
                    !newMedication.dosage ||
                    !newMedication.frequency ||
                    !newMedication.startDate ||
                    !newMedication.endDate ||
                    new Date(newMedication.endDate) < new Date(newMedication.startDate)
                  "
                />
              </div>
            </div>
          </q-form>
        </div>

        <q-separator class="q-my-md" />

        <!-- Especialidad (si viene como props el listado specialties) -->
        <div v-if="specialties.length > 0" class="col-12">
          <q-select
            v-model="prescription.specialty"
            ref="specialtyInput"
            :options="specialties"
            option-value="id"
            option-label="name"
            label="Especialidad de la receta"
            :rules="[(val) => !!val || 'La especialidad es obligatoria']"
            emit-value
            map-options
            :readonly="readonly"
            filled
          />

          <q-separator class="q-my-md" />
        </div>

        <q-btn
          class="full-width"
          color="primary"
          :label="readonly ? 'Cerrar' : 'Guardar receta'"
          @click="submitPrescription()"
          :disable="prescription.medications?.length === 0"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
