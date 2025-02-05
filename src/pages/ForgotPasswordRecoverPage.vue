<script lang="ts" setup>
import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'

import { Loading, Notify } from 'quasar'
import { useAuthStore } from 'src/stores/AuthStore'
import { useRoute, useRouter } from 'vue-router'
import { getPasswordValidatedFormConfig } from 'src/config/PasswordFormConfig'
import { onBeforeMount } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = route.params.token as string

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const submit = async (data: any) => {
  const password = data.password

  Loading.show({
    message: 'Restableciendo contraseña...',
  })

  const response = await authStore.resetPassword(token, password)

  try {
    if (response.success) {
      Notify.create({
        icon: 'check',
        message:
          'Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.',
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

onBeforeMount(() => {})
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm text-center">
      <q-img src="~assets/logo.svg" style="width: 150px" alt="Logo" />

      <div class="q-mt-lg text-h4">Project Salus</div>
      <div class="q-mt-none q-mb-lg">Vamos a recuperar tu cuenta</div>

      <EntityValidatedForm
        class="entity-validated-form"
        :entity-validation-config="getPasswordValidatedFormConfig()"
        @form:validated="submit"
      >
        <template #submitButton>
          <q-btn label="Recuperar contraseña" color="primary" type="submit" />
        </template>
      </EntityValidatedForm>
    </div>
  </q-page>
</template>

<style scoped>
.entity-validated-form:deep(.q-input:has(div[role='alert'])) {
  display: block;
  margin-bottom: 2.2rem;
}

.entity-validated-form:deep(.q-input + .q-input) {
  margin-top: 1rem;
}

.entity-validated-form:deep(.actions) {
  display: block;
  margin-top: 1rem;
}
</style>
