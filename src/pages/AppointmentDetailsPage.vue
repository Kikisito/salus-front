<script lang="ts" setup>
//const route = useRoute()
//const appointmentId = route.params.id
import AppointmentModal from 'src/components/AppointmentModal.vue'
import DeleteModal from 'src/components/DeleteModal.vue'
import { ref } from 'vue'

const cita = {
  especialidad: 'Fisiología',
  centro_medico: 'Hospital General de Alicante',
  fecha: '2024-12-10',
  hora: '13:15',
  ubicacion: 'Avda. Conde de Lumiares, 37, 03010 Alicante',
  doctor: 'Dr. Juan Martínez',
  tipo: 'Presencial',
}

const editModal = ref(false)
const deleteModal = ref(false)

// Fab
const fab = ref(false)

// Map
const center = ref([40, 40])
const projection = ref('EPSG:4326')
const zoom = ref(8)
const rotation = ref(0)
</script>

<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="section-header">
          <div class="text-h6">Tu cita de Fisiología</div>
        </div>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Especialidad</q-item-label>
              <q-item-label caption>Fisiología</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Fecha</q-item-label>
              <q-item-label caption>Miércoles, 10 de diciembre de 2024</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn outline size="sm">
                <q-icon class="cursor-pointer" name="calendar_month" />
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Hora</q-item-label>
              <q-item-label caption>Tu cita tendrá lugar a las 13:15 horas (1:15 PM)</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Ubicación</q-item-label>
              <q-item-label caption>Avda. Conde de Lumiares, 37, 03010 Alicante</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-btn outline size="sm">
                <q-icon class="cursor-pointer" name="open_in_new" />
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Doctor</q-item-label>
              <q-item-label caption>Dr. Juan Martínez</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Tipo</q-item-label>
              <q-item-label caption>Presencial</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-4 desktop-only">
        <div class="section-header">
          <div class="text-h6">Información sobre Dr. Juan Martínez</div>
        </div>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Nombre</q-item-label>
              <q-item-label caption>Dr. Juan Martínez</q-item-label>
            </q-item-section>

            <q-item-section avatar>
              <q-avatar>
                <img
                  src="https://this-person-does-not-exist.com/img/avatar-genfe80258a028351a2c3d02625c5ee034a.jpg"
                />
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Especialidad</q-item-label>
              <q-item-label caption>Fisiología</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Ubicación</q-item-label>
              <q-item-label caption>Avda. Conde de Lumiares, 37, 03010 Alicante</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Horario</q-item-label>
              <q-item-label caption>Lunes a viernes de 9:00 a 14:00 horas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Teléfono</q-item-label>
              <q-item-label caption>965 123 456</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Correo electrónico</q-item-label>
              <q-item-label caption> </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-12 col-md-4">
        <div class="section-header">
          <div class="text-h6">Ubicación de la cita</div>
        </div>

        <q-list>
          <q-item>
            <q-item-section>
              <ol-map style="width: 100%; aspect-ratio: 1" :interactions="[]">
                <ol-view
                  ref="view"
                  :center="center"
                  :rotation="rotation"
                  :zoom="zoom"
                  :projection="projection"
                />

                <ol-tile-layer>
                  <ol-source-osm />
                </ol-tile-layer>
              </ol-map>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-model="fab"
        label="Acciones"
        label-position="left"
        color="primary"
        icon="keyboard_arrow_up"
        vertical-actions-align="right"
        direction="up"
      >
        <q-fab-action color="red" icon="delete" label="Eliminar" @click="deleteModal = true" />
        <q-fab-action color="primary" icon="edit" label="Editar" @click="editModal = true" />
      </q-fab>
    </q-page-sticky>

    <AppointmentModal :appointment="cita" v-model:show="editModal" />
    <DeleteModal v-model:show="deleteModal" />
  </q-page>
</template>

<style scoped>
.q-list {
  margin: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.q-list--light {
  background-color: #f7fbff;
  border: 1px solid #e4e7eb;
}

.q-list--dark {
  background-color: #1a202c;
  border: 1px solid #2d3748;
}
</style>
