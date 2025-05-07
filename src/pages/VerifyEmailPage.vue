<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/AuthStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

const verificationStatus = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref<string>('')

onMounted(async () => {
  const token = route.params.token as string

  try {
    const response = await authStore.verifyEmail(token)

    if (response.success) {
      verificationStatus.value = 'success'
    } else {
      verificationStatus.value = 'error'
      errorMessage.value = response.error || 'Error al verificar el email'
    }
  } catch (error) {
    verificationStatus.value = 'error'
    errorMessage.value = 'Ha ocurrido un error durante la verificación'
    console.error('Error en verificación de email:', error)
  }
})
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm text-center">
      <q-img src="~assets/logo.svg" style="width: 150px" alt="Logo" />

      <div class="q-mt-lg text-h4">Project Salus</div>

      <!-- Cargando -->
      <div v-if="verificationStatus === 'loading'" class="q-mt-md">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-sm text-body1">Verificando tu correo electrónico...</div>
      </div>

      <!-- Éxito -->
      <div v-else-if="verificationStatus === 'success'" class="q-mt-md">
        <q-icon name="check_circle" color="positive" size="4em" />
        <div class="q-mt-sm text-h6">Correo electrónico verificado con éxito</div>
        <div class="q-mt-sm text-body1">
          Tu dirección de correo electrónico ha sido verificado correctamente.
        </div>

        <div class="row q-col-gutter-md q-mt-lg justify-center">
          <div class="col-12 col-sm-6">
            <q-btn
              color="primary"
              class="full-width"
              label="Iniciar sesión"
              @click="$router.push({ name: 'login' })"
            />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="q-mt-md">
        <q-icon name="error" color="negative" size="4em" />
        <div class="q-mt-sm text-h6">No se pudo verificar el email</div>
        <div class="q-mt-sm text-body1">
          {{ errorMessage }}
        </div>

        <div class="row q-col-gutter-md q-mt-lg justify-center">
          <div class="col-12 col-sm-6">
            <q-btn
              outline
              color="primary"
              class="full-width"
              label="Volver al inicio"
              @click="$router.push({ name: 'home' })"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
