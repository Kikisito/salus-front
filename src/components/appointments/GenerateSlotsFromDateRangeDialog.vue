<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Rango de fechas',
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

// Variables reactivas para fechas
const startDate = ref('')
const endDate = ref('')
const formRef = ref(null)
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="event" />
        </q-avatar>

        <q-toolbar-title>{{ title }}</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-form
        ref="formRef"
        @submit.prevent="
          onDialogOK({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          })
        "
      >
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="startDate"
                type="date"
                label="Fecha de inicio"
                :rules="[
                  (val) => !!val || 'La fecha de inicio es obligatoria',
                  (val) =>
                    new Date(val) >= new Date() ||
                    'La fecha de inicio debe ser mayor o igual a hoy',
                ]"
                hint="Seleccione la fecha de inicio"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="endDate"
                type="date"
                label="Fecha de fin"
                :rules="[
                  (val) => !!val || 'La fecha de fin es obligatoria',
                  (val) =>
                    new Date(val) >= new Date(startDate) ||
                    'La fecha de fin debe ser mayor o igual a la fecha de inicio',
                ]"
                hint="Seleccione la fecha de fin"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.q-card {
  width: 700px;
  max-width: 80vw;
}
</style>
