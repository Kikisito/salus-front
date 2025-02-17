<script lang="ts" setup>
import { getUserBasicDataValidatedFormConfig } from 'src/config/UserBasicDataFormConfig'
import { getDireccionValidatedFormConfig } from 'src/config/DireccionFormConfig'
import { getPasswordValidatedFormConfig } from 'src/config/PasswordFormConfig'
import { getUserContactDataValidatedFormConfig } from 'src/config/UserContactDataFormConfig'

import type { UserBasicData } from 'src/interfaces/UserBasicData'
import type { UserContactData } from 'src/interfaces/UserContactData'
import type { Direccion } from 'src/interfaces/Direccion'
import type { User } from 'src/interfaces/User'

import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loading, Notify } from 'quasar'

import EntityValidatedForm from 'src/components/EntityValidatedForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)

const submitForm = async (
  userBasicData: UserBasicData,
  userContactData: UserContactData,
  direccion: Direccion,
  password: string,
) => {
  Loading.show({
    message: 'Registrando cuenta...',
  })

  const user: User = {
    nombre: userBasicData.nombre,
    apellidos: userBasicData.apellidos,
    nif: userBasicData.nif,
    fechaNacimiento: userBasicData.fechaNacimiento,
    sexo: userBasicData.sexo,
    email: userContactData.email,
    telefono: userContactData.telefono,
    direccion: {
      lineaDireccion1: direccion.lineaDireccion1.length > 0 ? direccion.lineaDireccion1 : null,
      lineaDireccion2: direccion.lineaDireccion2.length > 0 ? direccion.lineaDireccion2 : null,
      codigoPostal: direccion.codigoPostal.length > 0 ? direccion.codigoPostal : null,
      provincia: direccion.provincia.length > 0 ? direccion.provincia : null,
      municipio: direccion.municipio.length > 0 ? direccion.municipio : null,
      localidad: direccion.localidad.length > 0 ? direccion.localidad : null,
    },
    password: password,
  } as User

  const registerResult = await authStore.register(user)
  if (registerResult.success) {
    router.push({ name: 'home' })
  } else {
    Notify.create({
      icon: 'report_problem',
      message: registerResult.error,
      color: 'negative',
    })
  }

  Loading.hide()
}

const userBasicData = ref(null as UserBasicData | null)
const handleBasicDataForm = async (data: UserBasicData) => {
  // Mostramos un mensaje de carga
  Loading.show({
    message: 'Validando datos...',
  })

  try {
    // Comprobamos si el NIF ya está en uso
    const nifAvailableRequest = await authStore.checkNif(data.nif)

    if (!nifAvailableRequest.success) {
      // Si la petición no ha tenido éxito, mostramos el mensaje de error
      Notify.create({
        icon: 'report_problem',
        message: nifAvailableRequest.error,
        color: 'negative',
      })
      return
    }
  } finally {
    // Ocultamos el mensaje de carga
    Loading.hide()
  }

  // En este punto, el NIF ha sido validado y no está en uso
  userBasicData.value = data
  step.value = 2
}

const userContactData = ref(null as UserContactData | null)
const handleContactDataForm = async (data: UserContactData) => {
  // Mostramos un mensaje de carga
  Loading.show({
    message: 'Validando datos...',
  })

  try {
    // Comprobamos si el NIF ya está en uso
    const emailAvailableRequest = await authStore.checkEmail(data.email)

    if (!emailAvailableRequest.success) {
      // Si la petición no ha tenido éxito, mostramos el mensaje de error
      Notify.create({
        icon: 'report_problem',
        message: emailAvailableRequest.error,
        color: 'negative',
      })
      return
    }
  } finally {
    // Ocultamos el mensaje de carga
    Loading.hide()
  }

  // En este punto, el email ha sido validado y no está en uso
  userContactData.value = data
  step.value = 3
}

const direccion = ref(null as Direccion | null)
const handleDireccionForm = (data: Direccion) => {
  direccion.value = data
  step.value = 4
}

const password = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePasswordForm = async (data: any) => {
  password.value = data.password

  // finally, handle form
  await submitForm(userBasicData.value!, userContactData.value!, direccion.value!, password.value)
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm">
      <q-page-sticky position="top">
        <div class="flex flex-center q-mt-xl">
          <q-img src="~assets/logo.svg" style="width: 50px" alt="Logo" />
          <div class="q-ml-sm text-h5">Project Salus</div>
        </div>
      </q-page-sticky>

      <q-stepper v-model="step" contracted flat done-color="green" animated>
        <q-step :name="1" title="Datos básicos" icon="person" :done="step > 1">
          <span class="register-header">¡Vamos a conocernos!</span>

          <EntityValidatedForm
            class="entity-validated-form"
            :entity-validation-config="getUserBasicDataValidatedFormConfig(userBasicData)"
            @form:validated="handleBasicDataForm"
          >
            <template #submitButton>
              <div class="full-width text-center">
                <q-btn label="Siguiente" color="primary" type="submit" />
              </div>
            </template>
          </EntityValidatedForm>
        </q-step>
        <q-step :name="2" title="Datos de contacto" icon="call" :done="step > 2" class="step-2">
          <span class="register-header">¿Cómo podemos contactarte?</span>

          <EntityValidatedForm
            class="entity-validated-form"
            :entity-validation-config="getUserContactDataValidatedFormConfig(userContactData)"
            @form:validated="handleContactDataForm"
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
        </q-step>
        <q-step :name="3" title="Dirección" icon="home" :done="step > 3">
          <span class="register-header">Indícanos tu dirección</span>

          <EntityValidatedForm
            class="entity-validated-form"
            :entity-validation-config="getDireccionValidatedFormConfig(direccion)"
            @form:validated="handleDireccionForm"
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
        </q-step>
        <q-step :name="4" title="Contraseña" icon="lock" :done="step > 4" class="step-4">
          <span class="register-header">Protejamos tu cuenta</span>

          <EntityValidatedForm
            class="entity-validated-form"
            :entity-validation-config="getPasswordValidatedFormConfig(password)"
            @form:validated="handlePasswordForm"
          >
            <template #submitButton>
              <div class="full-width text-center">
                <q-btn label="Volver" color="primary" outline @click="step = 3" />
              </div>
              <div class="full-width text-center">
                <q-btn label="Siguiente" color="primary" type="submit" />
              </div>
            </template>
          </EntityValidatedForm>
        </q-step>
      </q-stepper>

      <q-page-sticky position="bottom" class="q-mb-md" v-if="step === 1">
        <div class="column items-center full-width">
          <q-btn
            v-if="step === 1"
            style="background-color: #272e3e; color: white"
            class="q-mt-md"
            label="Ya soy usuario, quiero iniciar sesión"
            @click="$router.push({ name: 'login' })"
          />
        </div>
      </q-page-sticky>
    </div>
  </q-page>
</template>

}
<style lang="css" scoped>
.entity-validated-form:deep(.actions) {
  padding-top: 1rem;
}

.step-2 .entity-validated-form:deep(.q-input + .q-input) {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.step-4 .entity-validated-form:deep(.q-input:has(div[role='alert'])) {
  display: block;
  margin-bottom: 2.2rem;
}

.register-header {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.q-form > *:not(:first-child) {
  margin-top: 0.5rem;
}
</style>
