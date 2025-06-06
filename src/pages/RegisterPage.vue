<script lang="ts" setup>
import type { User } from 'src/interfaces/User'

import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loading, Notify } from 'quasar'

import CreateUserStepperForm from 'src/components/user/CreateUserStepperForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = ref<Partial<User>>({})

const submitForm = async (user: User) => {
  Loading.show({
    message: 'Registrando cuenta...',
  })

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
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-lg-6">
        <div class="flex flex-center q-mt-md">
          <q-img src="~assets/logo.svg" style="width: 50px" alt="Logo" />
          <div class="q-ml-sm text-h5">Project Salus</div>
        </div>

        <CreateUserStepperForm
          v-model:user="user"
          @form:cancel="$router.push({ name: 'home' })"
          @form:submit="submitForm"
        />

        <!--<q-stepper v-model="step" contracted flat done-color="green" animated>
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
              :entity-validation-config="getPasswordValidatedFormConfig()"
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
        </q-stepper>-->

        <!--<div class="column items-center q-mb-md">
          <q-btn
            style="background-color: #272e3e; color: white"
            class="q-mt-md"
            label="Ya soy usuario, quiero iniciar sesión"
            @click="$router.push({ name: 'login' })"
          />
        </div>-->
      </div>
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
