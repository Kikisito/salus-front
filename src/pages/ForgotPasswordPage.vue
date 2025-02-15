<script lang="ts" setup>
import type { ForgotPasswordRequest } from 'src/interfaces/ForgotPasswordRequest'

import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'

import { Loading, Notify } from 'quasar'
import { useAuthStore } from 'src/stores/AuthStore'
import { useRouter } from 'vue-router'
import { getForgotPasswordValidatedFormConfig } from 'src/config/ForgotPasswordFormConfig'

const router = useRouter()
const authStore = useAuthStore()

const submit = async (data: ForgotPasswordRequest) => {
  Loading.show({
    message: 'Enviando solicitud...',
  })

  const { nif, email } = data

  const response = await authStore.requestPasswordReset(email, nif)

  try {
    if (response.success) {
      Notify.create({
        icon: 'check',
        message:
          'Si los datos introducidos son correctos, recibirás un correo electrónico con las instrucciones para recuperar tu contraseña',
        color: 'positive',
      })

      router.push({ name: 'login' })
    } else {
      Notify.create({
        icon: 'report_problem',
        message: response.error,
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
      <div class="q-mt-none q-mb-lg">Vamos a recuperar tu cuenta</div>

      <EntityValidatedForm
        class="entity-validated-form"
        :entity-validation-config="getForgotPasswordValidatedFormConfig()"
        @form:validated="submit"
      >
        <template #submitButton>
          <q-btn label="Recuperar contraseña" color="primary" type="submit" />
        </template>
      </EntityValidatedForm>

      <div class="column items-center">
        <q-btn
          outline
          size="sm"
          class="q-mt-md"
          label="He recordado mi contraseña"
          @click="$router.push({ name: 'login' })"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.entity-validated-form:deep(.q-input:has(div[role='alert']) + .q-input) {
  margin-top: 1rem;
}

.entity-validated-form:deep(.actions) {
  display: block;
  margin-top: 1rem;
}
</style>
