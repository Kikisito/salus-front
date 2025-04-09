<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { Room } from 'src/interfaces/Room'
import type { PropType } from 'vue'

defineProps({
  room: {
    type: Object as PropType<Room>,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="meeting_room" />
        </q-avatar>

        <q-toolbar-title>Consulta</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div class="card-header q-mb-md">
          <q-icon name="meeting_room" size="2em" class="q-mr-sm" />
          <span class="text-h5 text-weight-regular q-mb-sm">{{ room.nombre }}</span>
          <span class="text-subtitle2">
            {{ room.centroMedico.nombre }}
          </span>

          <span class="text-subtitle2 text-weight-light">
            {{ room.centroMedico.lineaDireccion1 }}, {{ room.centroMedico.lineaDireccion2 }}
          </span>

          <span class="text-subtitle2 text-weight-light">
            {{ room.centroMedico.localidad }}, {{ room.centroMedico.municipio }}
            {{ room.centroMedico.codigoPostal }}, {{ room.centroMedico.provincia }}
          </span>
        </div>

        <q-separator />

        <div class="card-body q-mt-md">
          <span>Datos de contacto</span>
          <div class="q-mt-sm">
            <q-icon name="phone" size="1.5em" class="q-mr-sm" />
            <span class="text-subtitle2 text-weight-light">
              {{ room.centroMedico.telefono }}
            </span>
          </div>

          <div class="q-mt-sm">
            <q-icon name="email" size="1.5em" class="q-mr-sm" />
            <span class="text-subtitle2 text-weight-light">
              {{ room.centroMedico.email }}
            </span>
          </div>
        </div>

        <q-btn
          class="q-mt-md full-width"
          color="grey-9"
          label="Aceptar"
          @click="onDialogHide"
          v-close-popup
          outline
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.q-card {
  width: 400px;
  max-width: 80vw;
}

.card-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
}

.card-body {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
}
</style>
