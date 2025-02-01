<script lang="ts" setup>
import type { UserBasicData } from 'src/interfaces/UserBasicData'
import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'
import { getUserBasicDataValidatedFormConfig } from 'src/config/UserBasicDataFormConfig'
import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'
import { getDireccionValidatedFormConfig } from 'src/config/DireccionFormConfig'
import type { Direccion } from 'src/interfaces/Direccion'
import { getPasswordValidatedFormConfig } from 'src/config/PasswordFormConfig'
import type { User } from 'src/interfaces/User'

const authStore = useAuthStore()

const step = ref(1)

const submitForm = async (userBasicData: UserBasicData, direccion: Direccion, password: string) => {
  const user = {
    nombre: userBasicData.nombre,
    apellidos: userBasicData.apellidos,
    nif: userBasicData.nif,
    fechaNacimiento: userBasicData.fechaNacimiento,
    sexo: userBasicData.sexo,
    email: userBasicData.email,
    telefono: userBasicData.telefono,
    direccion: {
      lineaDireccion1: direccion.lineaDireccion1,
      lineaDireccion2: direccion.lineaDireccion2,
      codigoPostal: direccion.codigoPostal,
      provincia: direccion.provincia,
      localidad: direccion.localidad,
    },
    password: password,
  } as User

  console.log(authStore.register(user))
}

const userBasicData = ref(null as UserBasicData | null)
const handleBasicDataForm = (data: UserBasicData) => {
  userBasicData.value = data
  step.value = 2
}

const direccion = ref(null as Direccion | null)
const handleDireccionForm = (data: Direccion) => {
  direccion.value = data
  step.value = 3
}

const password = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePasswordForm = async (data: any) => {
  password.value = data.password
  step.value = 3

  // finally, handle form
  await submitForm(userBasicData.value!, direccion.value!, password.value)
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
        v-if="step === 1"
        :entity-validation-config="getUserBasicDataValidatedFormConfig(userBasicData)"
        @form:validated="handleBasicDataForm"
      >
        <template #submitButton>
          <div class="full-width text-center">
            <q-btn label="Siguiente" color="primary" type="submit" />
          </div>
        </template>
      </EntityValidatedForm>

      <!-- Segundo paso -->
      <EntityValidatedForm
        v-if="step === 2"
        :entity-validation-config="getDireccionValidatedFormConfig(direccion)"
        @form:validated="handleDireccionForm"
      >
        <template #submitButton>
          <div class="full-width text-center">
            <q-btn label="Volver" color="primary" outline @click="step = 1" />
          </div>
          <div class="full-width text-center">
            <q-btn label="Siguiente" color="primary" type="submit" />
          </div>
        </template>
      </EntityValidatedForm>

      <!-- Tercer paso -->
      <EntityValidatedForm
        v-if="step === 3"
        :entity-validation-config="getPasswordValidatedFormConfig(password)"
        @form:validated="handlePasswordForm"
      >
        <template #submitButton>
          <div class="full-width text-center">
            <q-btn label="Volver" color="primary" outline @click="step = 2" />
          </div>
          <div class="full-width text-center">
            <q-btn label="Siguiente" color="primary" type="submit" />
          </div>
        </template>
      </EntityValidatedForm>

      <div class="q-mt-xl column">
        <q-btn
          v-if="step === 1"
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
