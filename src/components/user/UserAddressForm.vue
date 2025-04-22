<script lang="ts" setup>
import type { Direccion } from 'src/interfaces/Direccion'

defineEmits(['form:submit', 'form:cancel'])

const address = defineModel<Partial<Direccion>>('address', { required: true })
</script>

<template>
  <q-form @submit.prevent="$emit('form:submit', address)">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-input v-model="address.lineaDireccion1" label="Línea de dirección 1" filled />
      </div>
      <div class="col-12 col-md-12">
        <q-input v-model="address.lineaDireccion2" label="Línea de dirección 2" filled />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="address.localidad" label="Localidad" filled />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="address.municipio" label="Municipio" filled />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="address.provincia" label="Provincia" filled />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="address.codigoPostal" label="Código postal" filled />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="address.pais" label="País" filled />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-btn
          class="q-mt-md full-width"
          icon="chevron_left"
          label="Volver"
          color="primary"
          @click="$emit('form:cancel')"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-btn
          class="q-mt-md full-width"
          icon-right="chevron_right"
          label="Siguiente"
          color="primary"
          type="submit"
        />
      </div>
    </div>
  </q-form>
</template>
