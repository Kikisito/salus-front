<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'

import { ref, type PropType } from 'vue'
import type { Report } from 'src/interfaces/Report'

const props = defineProps({
  report: {
    type: Object as PropType<Report>,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const readonly = ref(props.readonly)

// Modelo del formulario
const report = ref<Partial<Report>>(props.report || {})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="description" />
        </q-avatar>

        <q-toolbar-title>Informe</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(report)">
          <div class="row q-col-gutter-md">
            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="report.description"
                maxlength="30"
                label="Descripción"
                :rules="[
                  (val) => !!val || 'La descripción es obligatoria',
                  (val) => val.length <= 30 || 'Máximo 30 caracteres',
                ]"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Diagnóstico -->
            <div class="col-12">
              <q-input
                v-model="report.diagnosis"
                type="textarea"
                label="Diagnóstico"
                :rules="[(val) => !!val || 'El diagnóstico es obligatorio']"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Tratamiento -->
            <div class="col-12">
              <q-input
                v-model="report.treatment"
                type="textarea"
                label="Tratamiento"
                class="q-mb-md"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Observaciones -->
            <div class="col-12">
              <q-input
                v-model="report.observations"
                type="textarea"
                label="Observaciones"
                :readonly="readonly"
                filled
              />
            </div>
          </div>

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
