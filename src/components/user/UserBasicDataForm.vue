<script lang="ts" setup>
import type { User } from 'src/interfaces/User'
import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'

const emit = defineEmits(['form:submit', 'form:cancel'])

const authStore = useAuthStore()

const user = defineModel<Partial<User>>('user', { required: true })
const genderAux = ref(user.value.sexo || '')

async function submit() {
  emit('form:submit', user.value)
}

// Métodos y constantes auxiliares de validación
const idCardValidationRules = [
  (val: string) => !!val || 'Campo requerido',
  (val: string) =>
    (/^\d{8}[A-Z]$/.test(val) && verifyDni(val)) ||
    (/^[XYZ]\d{7}[A-Z]$/.test(val) && verifyNie(val)) ||
    'Formato de NIF incorrecto',
  async (val: string) => {
    if (val) {
      const isRegistered = !(await authStore.checkNif(val)).success
      return !isRegistered || 'Este documento de identidad ya está en uso'
    }
    return true
  },
]

function verifyDni(nif: string) {
  const letter = nif.charAt(nif.length - 1).toUpperCase()
  const number = nif.substring(0, nif.length - 1)
  const letterValues = 'TRWAGMYFPDXBNJZSQVHLCKET'
  const mod = parseInt(number, 10) % 23
  const expectedLetter = letterValues.charAt(mod)
  return letter === expectedLetter
}

function verifyNie(nif: string) {
  const letterValues = 'TRWAGMYFPDXBNJZSQVHLCKET'
  const niePrefix = nif.charAt(0)
  const niePrefixes = 'XYZ'
  const niePrefixValue = niePrefixes.indexOf(niePrefix)
  if (niePrefixValue === -1) {
    return false
  }
  const nieNumber = nif.substring(1, nif.length - 1)
  const mod = parseInt(nieNumber, 10) % 23
  const expectedLetter = letterValues.charAt(mod)
  return nif.charAt(nif.length - 1) === expectedLetter
}
</script>

<template>
  <q-form @submit.prevent="submit()">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="user.nombre"
          label="Nombre"
          hint="En caso de nombre compuesto, separa por espacio"
          :rules="[
            (val) => !!val || 'Campo requerido',
            (val) => val.length <= 50 || 'Introduce un máximo de 50 caracteres',
            (val) => val.length >= 2 || 'Introduce un mínimo de 2 caracteres',
          ]"
          filled
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="user.apellidos"
          label="Apellidos"
          :rules="[
            (val) => !!val || 'Campo requerido',
            (val) => val.length <= 100 || 'Introduce un máximo de 100 caracteres',
            (val) => val.length >= 2 || 'Introduce un mínimo de 2 caracteres',
          ]"
          filled
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="user.nif"
          ref="idCardInput"
          label="Documento de identidad"
          hint="Introduce tu DNI o NIE"
          :rules="idCardValidationRules"
          filled
          @update:model-value="user.nif = user.nif ? user.nif.toUpperCase() : ''"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="user.fechaNacimiento"
          type="date"
          label="Fecha de nacimiento"
          hint="No se permite el registro de menores de edad"
          :rules="[
            (val) => !!val || 'Campo requerido',
            (val) => new Date(val) < new Date() || 'El usuario no puede haber nacido en el futuro',
            (val) =>
              (!!val &&
                new Date(val) < new Date() &&
                new Date().getFullYear() - new Date(val).getFullYear() >= 18) ||
              'El usuario debe ser mayor de edad',
          ]"
          filled
        />
      </div>
      <div
        :class="{
          'col-12': true,
          'col-md-6 q-mb-md': genderAux === 'Otro',
        }"
      >
        <q-select
          v-model="genderAux"
          label="Sexo"
          :options="['Hombre', 'Mujer', 'Otro']"
          :rules="[(val) => !!val || 'Campo requerido']"
          filled
          @update:model-value="genderAux !== 'Otro' ? (user.sexo = genderAux) : (user.sexo = '')"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-if="genderAux === 'Otro'"
          v-model="user.sexo"
          label="Especifica el sexo"
          :rules="[(val) => !!val || 'Campo requerido']"
          filled
        />
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
          :disable="
            !user.nombre || !user.apellidos || !user.nif || !user.fechaNacimiento || !user.sexo
          "
        />
      </div>
    </div>
  </q-form>
</template>
