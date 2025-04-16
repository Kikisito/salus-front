<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { Specialty } from 'src/interfaces/Specialty'
import { ref, type PropType } from 'vue'

const props = defineProps({
  specialtyProp: {
    type: Object as PropType<Specialty>,
    required: false,
    default: null,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const specialty = ref<Specialty>({
  id: props.specialtyProp?.id || 0,
  name: props.specialtyProp?.name || '',
  description: props.specialtyProp?.description || '',
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="medical_services" />
        </q-avatar>

        <q-toolbar-title>Especialidad médica</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(specialty)">
          <div class="text-h6 text-center q-mb-md">Datos de la especialidad</div>

          <q-input
            filled
            v-model="specialty.name"
            label="Nombre"
            :rules="[(val) => !!val || 'El nombre es obligatorio']"
          />

          <q-input
            filled
            v-model="specialty.description"
            label="Descripción"
            type="textarea"
            :rules="[(val) => !!val || 'La descripción es obligatoria']"
          />

          <q-btn class="q-mt-md full-width" color="grey-9" label="Guardar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.q-card {
  width: 700px;
  max-width: 80vw;
}
</style>
