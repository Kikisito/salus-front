<script lang="ts" setup>
import { HeFilledAllergies, HeFilledRunning } from '@kalimahapps/vue-icons'
import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'
import PreviaCita from 'src/components/PreviaCita.vue'
import { getCitaValidatedFormConfig } from 'src/config/CitaValidatedFormConfig'
import { h, ref } from 'vue'

const showDialog = ref(false)

const citas = [
  {
    id: 1,
    especialidad: 'Alergología',
    doctor: 'Dr. María Hernández',
    fecha: '10 de diciembre de 2024',
    hora: '13:00',
    icon: h(HeFilledAllergies),
  },
  {
    id: 2,
    especialidad: 'Fisiología',
    doctor: 'Dr. Juan Martínez',
    fecha: 'Hoy',
    hora: '9:16',
    icon: h(HeFilledRunning),
  },
]
</script>

<template>
  <q-page padding>
    <div class="section-header">
      <div class="text-h6">Tus próximas citas</div>
    </div>

    <PreviaCita v-for="cita in citas" :key="cita.id" :cita="cita" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        style="background-color: #f1f4f8; color: #65558f"
        @click="showDialog = true"
      />
    </q-page-sticky>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Creando una nueva cita</div>
        </q-card-section>

        <q-card-section>
          <EntityValidatedForm :entityValidationConfig="getCitaValidatedFormConfig()">
              <template #submitButton>
                <q-btn color="primary" label="Añadir" />
              </template>
          </EntityValidatedForm>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
