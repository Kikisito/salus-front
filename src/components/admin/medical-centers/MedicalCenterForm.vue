<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import { ref, type PropType } from 'vue'

const props = defineProps({
  medicalCenterProp: {
    type: Object as PropType<MedicalCenter>,
    required: false,
    default: null,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const medicalCenter = ref<MedicalCenter>({
  id: props.medicalCenterProp?.id || 0,
  nombre: props.medicalCenterProp?.nombre || '',
  telefono: props.medicalCenterProp?.telefono || '',
  email: props.medicalCenterProp?.email || '',
  lineaDireccion1: props.medicalCenterProp?.lineaDireccion1 || '',
  lineaDireccion2: props.medicalCenterProp?.lineaDireccion2 || '',
  localidad: props.medicalCenterProp?.localidad || '',
  municipio: props.medicalCenterProp?.municipio || '',
  codigoPostal: props.medicalCenterProp?.codigoPostal || '',
  provincia: props.medicalCenterProp?.provincia || '',
  pais: props.medicalCenterProp?.pais || '',
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="domain" />
        </q-avatar>

        <q-toolbar-title>Centro médico</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(medicalCenter)">
          <div class="text-h6 text-center q-mb-md">Datos básicos</div>
          <q-input
            filled
            v-model="medicalCenter.nombre"
            label="Nombre"
            class="q-mb-md"
            :rules="[(val) => !!val || 'El nombre es obligatorio']"
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input filled v-model="medicalCenter.telefono" label="Teléfono" class="q-mb-md" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.email"
                label="Email"
                class="q-mb-md"
                :rules="[
                  (val) => !!val || 'El email es obligatorio',
                  (val) => /.+@.+\..+/.test(val) || 'El email no es válido',
                ]"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-h6 text-center q-mb-md">Dirección</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.lineaDireccion1"
                label="Línea de Dirección 1"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La línea de dirección 1 es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.lineaDireccion2"
                label="Línea de Dirección 2"
                class="q-mb-md"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.localidad"
                label="Localidad"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La localidad es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.municipio"
                label="Municipio"
                class="q-mb-md"
                :rules="[(val) => !!val || 'El municipio es obligatorio']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="medicalCenter.provincia"
                label="Provincia"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La provincia es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="medicalCenter.codigoPostal"
                label="Código Postal"
                class="q-mb-md"
                :rules="[(val) => !!val || 'El código postal es obligatorio']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="medicalCenter.pais"
                label="País"
                class="q-mb-md"
                :rules="[(val) => !!val || 'El país es obligatorio']"
              />
            </div>
          </div>

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
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
