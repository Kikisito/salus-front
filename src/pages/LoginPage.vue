<script lang="ts" setup>
import { getLoginValidatedFormConfig } from 'src/config/LoginFormConfig'
import type { LoginRequest } from 'src/interfaces/LoginRequest'

import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'

import { Loading, Notify } from 'quasar'
import { useAuthStore } from 'src/stores/AuthStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const login = async (data: LoginRequest) => {
  Loading.show({
    message: 'Iniciando sesión...',
  })

  const { nif, password } = data

  const loginResult = await authStore.login(nif, password)

  try {
    if (loginResult.success) {
      // Si el login es correcto, redirigimos al usuario a la página de inicio
      router.push({ name: 'home' })
    } else {
      // Si el login es incorrecto, mostramos el mensaje de error
      Notify.create({
        icon: 'report_problem',
        message: loginResult.error,
        color: 'negative',
      })
    }
  } finally {
    Loading.hide()
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm text-center">
      <q-img src="~assets/logo.svg" style="width: 150px" alt="Logo" />

      <div>
        <div class="q-mt-lg text-h4">Centro Especializado</div>
        <div class="q-mt-none text-h4">Ergofisio Alicante</div>
      </div>
      <div class="q-mt-sm q-mb-lg">¿Ya eres usuario? ¡Inicia sesión!</div>

      <EntityValidatedForm
        class="entity-validated-form"
        :entity-validation-config="getLoginValidatedFormConfig()"
        @form:validated="login"
      >
        <template #submitButton>
          <q-btn label="Acceder" color="primary" type="submit" />
        </template>
      </EntityValidatedForm>

      <div class="column items-center">
        <q-btn
          style="background-color: #272e3e; color: white"
          class="q-mt-md"
          label="No soy usuario, quiero registrarme"
          @click="$router.push({ name: 'register' })"
        />
        <q-btn
          flat
          dense
          size="sm"
          class="q-mt-md"
          label="He olvidado mi contraseña"
          @click="$router.push({ name: 'forgot-password' })"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.q-form {
  max-width: 300px;
  margin: 0 auto;
}

.entity-validated-form:deep(.q-input:has(div[role='alert']) + .q-input) {
  margin-top: 1rem;
}

.entity-validated-form:deep(.actions) {
  display: block;
  margin-top: 1rem;
}
</style>
