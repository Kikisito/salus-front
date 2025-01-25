<script lang="ts" setup>
import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const login = async () => {
  await authStore.login(email.value, password.value)
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm text-center">
      <q-img src="~assets/logo.svg" style="width: 200px" alt="Logo" />

      <div class="q-mt-lg text-h4">Project Salus</div>
      <div class="q-mt-none q-mb-lg">¿Ya eres usuario? ¡Inicia sesión!</div>

      <q-banner inline-actions class="bg-red text-white" v-if="authStore.error">
        <span>{{ authStore.error }}</span>
        <template v-slot:action>
          <q-btn flat label="OK" color="white" @click="authStore.error = ''" />
        </template>
      </q-banner>

      <q-form @submit.prevent="" class="q-mt-md text-center">
        <q-input filled v-model="email" label="DNI/NIF/NIE" autocomplete="username" />
        <q-input
          filled
          v-model="password"
          label="Contraseña"
          type="password"
          autocomplete="current-password"
          lazy-rules
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <q-btn label="Acceder" color="primary" @click="login" />
      </q-form>

      <div class="q-mt-xl column">
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
          @click="authStore.error = '¡Ups! Esta funcionalidad aún no está disponible.'"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="css" scoped>
.q-form > *:not(:first-child) {
  margin-top: 0.5rem;
}
</style>
