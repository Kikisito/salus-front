<script setup lang="ts">
import { getPasswordValidatedFormConfig } from 'src/config/PasswordFormConfig'
import EntityValidatedForm from './EntityValidatedForm.vue'
import { ref } from 'vue'

const emit = defineEmits(['form:validated'])

const changePasswordForm = ref()

const updateEntity = (values: string) => {
  // Borramos el formulario
  changePasswordForm.value.handleReset()

  // Pasamos los datos al componente padre
  emit('form:validated', values)
}

function getUnifiedForm() {
  const passwordFormConfig = getPasswordValidatedFormConfig()

  return {
    validationSchema: {
      currentPassword() {
        return true // No validamos ya que una contraseña antigua puede haber sido validada con otro esquema
      },
      ...passwordFormConfig.validationSchema,
    },
    initialValues: {
      currentPassword: '',
      ...passwordFormConfig.initialValues,
    },
    formFieldsConfig: {
      currentPassword: {
        type: 'password',
        label: 'Contraseña actual',
        hint: 'Para cambiar tu contraseña, debes introducir la actual',
        autocomplete: 'current-password',
      },
      ...passwordFormConfig.formFieldsConfig,
    },
  }
}
</script>

<template>
  <EntityValidatedForm
    ref="changePasswordForm"
    :entityValidationConfig="getUnifiedForm()"
    :resetAfterSubmit="true"
    @form:validated="updateEntity"
  >
    <template #submitButton>
      <div class="full-width text-center">
        <q-btn label="Cambiar contraseña" color="red" type="submit" icon="edit" />
      </div>
    </template>
  </EntityValidatedForm>
</template>

<style scoped>
@media screen and (max-width: 1600px) {
  :deep(.q-field:has(div[role='alert'])) {
    padding-bottom: 2.5rem;
  }

  :deep(.q-field) {
    padding-bottom: 2rem;
  }
}
</style>
