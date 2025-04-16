<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { Specialty } from 'src/interfaces/Specialty'
import type { PropType } from 'vue'

defineProps({
  specialty: {
    type: Object as PropType<Specialty>,
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
          <q-icon name="medical_services" />
        </q-avatar>

        <q-toolbar-title>Especialidad médica</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div class="card-header q-mb-md">
          <q-icon name="medical_services" size="2em" class="q-mr-sm" />
          <span class="text-h5 text-weight-regular q-mb-sm">{{ specialty.name }}</span>
        </div>

        <q-separator />

        <div class="card-body q-mt-md">
          <span>Descripción</span>
          <p class="text-subtitle2 text-weight-light q-mt-sm">
            {{ specialty.description }}
          </p>
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
