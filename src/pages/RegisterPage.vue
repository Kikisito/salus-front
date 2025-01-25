<script lang="ts" setup>
import type { UserBasicData } from 'src/interfaces/UserBasicData'
import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'
import { getUserBasicDataValidatedFormConfig } from 'src/config/UserBasicDataFormConfig'
import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()

const user = ref({
  nombre: '',
  apellidos: '',
  nif: '',
  email: '',
  telefono: '',
  sexo: '',
  direccion: {
    linea1: '',
    linea2: '',
    cp: '',
    provincia: '',
    localidad: '',
  },
  password: '',
})

const handleBasicDataForm = (data: UserBasicData) => {
  user.value.nombre = data.nombre
  user.value.apellidos = data['apellidos']
  user.value.nif = data['nif']
  user.value.email = data['email']
  user.value.telefono = data['telefono']
  user.value.sexo = data['sexo']
  console.log(user.value)
}
</script>

<template>
  <q-page padding class="full-height">
    <div class="q-pa-sm text-center">
      <div class="flex flex-center q-mb-md">
        <q-img src="~assets/logo.svg" style="width: 50px" alt="Logo" />
        <div class="q-ml-sm text-h5">Project Salus</div>
      </div>

      <q-banner inline-actions class="bg-red text-white" v-if="authStore.error">
        <span>{{ authStore.error }}</span>
        <template v-slot:action>
          <q-btn flat label="OK" color="white" @click="authStore.error = ''" />
        </template>
      </q-banner>

      <!-- Primer paso -->
      <EntityValidatedForm
        :entity-validation-config="getUserBasicDataValidatedFormConfig()"
        @form:validated="handleBasicDataForm"
      >
        <template #submitButton>
          <div class="full-width text-center">
            <q-btn label="Siguiente" color="primary" type="submit" />
          </div>
        </template>
      </EntityValidatedForm>

      <!-- Segundo paso -->

      <div class="q-mt-xl column">
        <q-btn
          style="background-color: #272e3e; color: white"
          class="q-mt-md"
          label="Ya soy usuario, quiero iniciar sesión"
          @click="$router.push({ name: 'login' })"
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
