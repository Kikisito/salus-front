<template>
  <router-view />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useAuthStore } from './stores/AuthStore'

const authStore = useAuthStore()

watchEffect(async () => {
  if (authStore.isAuthenticated) {
    // Cuando se inicia la app y cuando cambia la sesión, se obtiene el perfil del usuario y se almacena en memoria
    await authStore.getCurrentProfile()
  }
})
</script>
