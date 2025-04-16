<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { PropType } from 'vue'

defineProps({
  medicalCenter: {
    type: Object as PropType<MedicalCenter>,
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
          <q-icon name="domain" />
        </q-avatar>

        <q-toolbar-title>Centro médico</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div class="card-header q-mb-md">
          <q-icon name="domain" size="2em" class="q-mr-sm" />
          <span class="text-h5 text-weight-regular q-mb-sm">{{ medicalCenter.name }}</span>

          <span class="text-subtitle2 text-weight-light">
            {{ medicalCenter.addressLine1 }}, {{ medicalCenter.addressLine2 }}
          </span>

          <span class="text-subtitle2 text-weight-light">
            {{ medicalCenter.locality }}, {{ medicalCenter.municipality }}
            {{ medicalCenter.zipCode }}, {{ medicalCenter.province }}
          </span>
        </div>

        <q-separator />

        <div class="card-body q-mt-md">
          <span>Datos de contacto</span>
          <div class="q-mt-sm">
            <q-icon name="phone" size="1.5em" class="q-mr-sm" />
            <span class="text-subtitle2 text-weight-light">
              {{ medicalCenter.phone }}
            </span>
          </div>

          <div class="q-mt-sm">
            <q-icon name="email" size="1.5em" class="q-mr-sm" />
            <span class="text-subtitle2 text-weight-light">
              {{ medicalCenter.email }}
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
