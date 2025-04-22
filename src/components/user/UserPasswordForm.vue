<script lang="ts" setup>
import type { User } from 'src/interfaces/User'
import { ref } from 'vue'

defineEmits(['form:submit', 'form:cancel'])

const user = defineModel<Partial<User>>('user', { required: true })
const passwordConfirmation = ref<string>('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
</script>

<template>
  <q-form @submit.prevent="$emit('form:submit', user)">
    <div class="row q-col-gutter-md">
      <!-- Campo principal de contraseña -->
      <div class="col-12 col-md-12">
        <q-input
          v-model="user.password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          hint="Introduce al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial"
          :rules="[
            (val) =>
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{8,}$/.test(val) ||
              'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
          ]"
          filled
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>

      <!-- Campo de confirmación de contraseña -->
      <div class="col-12 col-md-12">
        <q-input
          v-model="passwordConfirmation"
          :type="showPasswordConfirmation ? 'text' : 'password'"
          label="Confirmación de la contraseña"
          hint="Confirma tu contraseña"
          :rules="[(val) => val === user.password || 'Las contraseñas no coinciden']"
          filled
        >
          <template v-slot:append>
            <q-icon
              :name="showPasswordConfirmation ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPasswordConfirmation = !showPasswordConfirmation"
            /> </template
        ></q-input>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-btn
          class="q-mt-md full-width"
          icon="chevron_left"
          label="Volver"
          color="primary"
          @click="$emit('form:cancel')"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-btn
          class="q-mt-md full-width"
          icon-right="chevron_right"
          label="Siguiente"
          color="primary"
          type="submit"
        />
      </div>
    </div>
  </q-form>
</template>
