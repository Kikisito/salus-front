<script lang="ts" setup>
import type { User } from 'src/interfaces/User'
import { useAuthStore } from 'src/stores/AuthStore'

defineEmits(['form:submit', 'form:cancel'])

const authStore = useAuthStore()

const user = defineModel<Partial<User>>('user', { required: true })

// Métodos y constantes auxiliares de validación
const emailValidationRules = [
  (val: string) => !!val || 'Campo requerido',
  (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'El correo electrónico introducido no es válido',
  async (val: string) => {
    if (val) {
      const isRegistered = !(await authStore.checkEmail(val)).success
      return !isRegistered || 'Este correo electrónico ya está en uso'
    }
    return true
  },
]
</script>

<template>
  <q-form @submit.prevent="$emit('form:submit', user)">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-input
          v-model="user.email"
          label="Correo electrónico"
          hint="Ejemplo: juan@gmail.com"
          :rules="emailValidationRules"
          filled
        />
      </div>
      <div class="col-12 col-md-12">
        <q-input
          v-model="user.telefono"
          label="Teléfono"
          hint="Será utilizado para enviar recordatorios"
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
          :disable="!user.email || !user.telefono"
        />
      </div>
    </div>
  </q-form>
</template>
