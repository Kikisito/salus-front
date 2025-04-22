<script lang="ts" setup>
import type { Direccion } from 'src/interfaces/Direccion'
import type { User } from 'src/interfaces/User'
import { ref } from 'vue'
import UserBasicDataForm from './UserBasicDataForm.vue'
import UserContactDataForm from './UserContactDataForm.vue'
import UserAddressForm from './UserAddressForm.vue'
import UserPasswordForm from './UserPasswordForm.vue'

defineProps({
  randomPassword: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['form:submit', 'form:cancel'])

const user = ref<Partial<User>>({})
const step = ref(1)

async function onSubmit() {
  if (step.value === 1) {
    step.value++
  } else if (step.value === 2) {
    user.value.direccion = {} as Direccion
    step.value++
  } else if (step.value === 3) {
    step.value++
  } else if (step.value === 4) {
    emit('form:submit', user.value)
  }
}
</script>

<template>
  <q-stepper v-model="step" contracted flat done-color="green" animated>
    <q-step :name="1" title="Datos básicos" icon="person" :done="step > 1">
      <UserBasicDataForm
        v-model:user="user"
        @form:submit="onSubmit()"
        @form:cancel="$emit('form:cancel')"
      />
    </q-step>

    <q-step :name="2" title="Datos de contacto" icon="call" :done="step > 2" class="step-2">
      <UserContactDataForm v-model:user="user" @form:submit="onSubmit()" @form:cancel="step--" />
    </q-step>

    <q-step :name="3" title="Dirección" icon="home" :done="step > 3">
      <UserAddressForm
        v-model:address="user.direccion!"
        @form:submit="onSubmit()"
        @form:cancel="step--"
      />
    </q-step>

    <q-step :name="4" title="Contraseña" icon="lock" :done="step > 4" class="step-4">
      <UserPasswordForm
        v-if="!randomPassword"
        v-model:user="user"
        @form:submit="onSubmit()"
        @form:cancel="step--"
      />

      <template v-else>
        <q-banner inline-actions class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="lock" size="2rem" />
          </template>

          <div class="text-h6">Seguridad de la cuenta</div>

          <span class="block">
            Esta cuenta se va a crear con una contraseña aleatoria. Se enviará al correo electrónico
            introducido un mensaje con un enlace para que el usuario pueda establecer su propia
            contraseña de forma segura.
          </span>

          <span class="block q-mt-md">
            Al pulsar el botón "Siguiente", se procederá definitivamente a realizar esta acción
            irreversible. Si no deseas esto, puedes cancelar la creación cerrando esta ventana o
            pulsando "Volver".
          </span>
        </q-banner>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              class="q-mt-md full-width"
              icon="chevron_left"
              label="Volver"
              color="primary"
              @click="step--"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-btn
              class="q-mt-md full-width"
              icon-right="chevron_right"
              label="Siguiente"
              color="primary"
              @click="onSubmit()"
            />
          </div>
        </div>
      </template>
    </q-step>
  </q-stepper>
</template>
