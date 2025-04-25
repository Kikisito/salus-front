<template>
  <router-view />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useUserStore } from './stores/UserStore'
import { useAuthStore } from './stores/AuthStore'

const authStore = useAuthStore()
const userStore = useUserStore()

watchEffect(async () => {
  if (authStore.isAuthenticated) {
    // Cuando se inicia la app y cuando cambia la sesión, se obtiene el perfil del usuario y se almacena en memoria
    try {
      await userStore.getCurrentUser()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Si hay un error al obtener el perfil del usuario, se cierra la sesión
      await authStore.logout()
    }
  }
})
</script>
