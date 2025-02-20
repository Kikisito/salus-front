<script lang="ts" setup>
import { watch, ref } from 'vue'
import type { PropType } from 'vue'
import type { User } from 'src/interfaces/User'
import EntityValidatedForm from './EntityValidatedForm.vue'
import { getUserBasicDataValidatedFormConfig } from 'src/config/UserBasicDataFormConfig'
import { getUserContactDataValidatedFormConfig } from 'src/config/UserContactDataFormConfig'

const props = defineProps({
  user: {
    type: [Object, null] as PropType<User | null>,
    required: false,
    default: null,
  },
})

defineEmits(['form:submit'])

const showModal = defineModel('show', { default: false, type: Boolean })

// Estado reactivo para el formulario
const unifiedUserForm = ref(getUnifiedUserForm(props.user))

// Watch para actualizar los datos cuando 'props.user' cambia
watch(
  () => props.user,
  (newUser) => {
    unifiedUserForm.value = getUnifiedUserForm(newUser)
  },
  { deep: true },
)

// Función para obtener la configuración del formulario
function getUnifiedUserForm(user: User | null) {
  const basicDataFormConfig = getUserBasicDataValidatedFormConfig(user)
  const contactDataFormConfig = getUserContactDataValidatedFormConfig(user)

  return {
    validationSchema: {
      ...basicDataFormConfig.validationSchema,
      ...contactDataFormConfig.validationSchema,
    },
    initialValues: {
      ...basicDataFormConfig.initialValues,
      ...contactDataFormConfig.initialValues,
    },
    formFieldsConfig: {
      ...basicDataFormConfig.formFieldsConfig,
      ...contactDataFormConfig.formFieldsConfig,
    },
  }
}
</script>

<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Editando perfil</div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm
          :entityValidationConfig="unifiedUserForm"
          @form:validated="$emit('form:submit', $event)"
        >
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="showModal = false" />
            <q-btn type="submit" color="primary" label="Actualizar" />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
:deep(.q-field:has(.q-field__messages)) {
  margin-bottom: -0.5rem;
}

:deep(.q-field__messages) {
  display: none;
}
</style>
