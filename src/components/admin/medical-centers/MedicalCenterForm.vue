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
  name: props.medicalCenterProp?.name || '',
  phone: props.medicalCenterProp?.phone || '',
  email: props.medicalCenterProp?.email || '',
  addressLine1: props.medicalCenterProp?.addressLine1 || '',
  addressLine2: props.medicalCenterProp?.addressLine2 || '',
  locality: props.medicalCenterProp?.locality || '',
  municipality: props.medicalCenterProp?.municipality || '',
  zipCode: props.medicalCenterProp?.zipCode || '',
  province: props.medicalCenterProp?.province || '',
  country: props.medicalCenterProp?.country || '',
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
            v-model="medicalCenter.name"
            label="Nombre"
            class="q-mb-md"
            :rules="[(val) => !!val || 'El nombre es obligatorio']"
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input filled v-model="medicalCenter.phone" label="Teléfono" class="q-mb-md" />
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
                v-model="medicalCenter.addressLine1"
                label="Línea de Dirección 1"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La línea de dirección 1 es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.addressLine2"
                label="Línea de Dirección 2"
                class="q-mb-md"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.locality"
                label="Localidad"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La localidad es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="medicalCenter.municipality"
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
                v-model="medicalCenter.province"
                label="Provincia"
                class="q-mb-md"
                :rules="[(val) => !!val || 'La provincia es obligatoria']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="medicalCenter.zipCode"
                label="Código Postal"
                class="q-mb-md"
                :rules="[(val) => !!val || 'El código postal es obligatorio']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="medicalCenter.country"
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
