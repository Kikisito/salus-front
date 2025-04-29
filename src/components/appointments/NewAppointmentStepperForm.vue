<script lang="ts" setup>
import type { User } from 'src/interfaces/User'
import { ref } from 'vue'

const emit = defineEmits(['form:submit', 'form:cancel'])

const user = ref<Partial<User>>({})
const step = ref(1)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSubmit() {
  if (step.value === 1) {
    step.value++
  } else if (step.value === 2) {
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
    <q-step :name="1" title="Datos básicos" icon="person" :done="step > 1"> Pendiente </q-step>

    <q-step :name="2" title="Datos de contacto" icon="call" :done="step > 2" class="step-2">
      2
    </q-step>

    <q-step :name="3" title="Dirección" icon="home" :done="step > 3"> 3 </q-step>

    <q-step :name="4" title="Contraseña" icon="lock" :done="step > 4" class="step-4"> 4 </q-step>
  </q-stepper>
</template>
