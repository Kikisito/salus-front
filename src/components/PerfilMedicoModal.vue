<script lang="ts" setup>
import type { PropType } from 'vue'
import EntityValidatedForm from './EntityValidatedForm.vue'
import type { PerfilMedico } from 'src/interfaces/PerfilMedico'
import { getPerfilMedicoValidatedFormConfig } from 'src/config/PerfilMedicoFormConfig'

defineProps({
  perfilMedico: {
    type: [Object, undefined] as PropType<PerfilMedico | undefined>,
    required: false,
    default: null,
  },
})

defineEmits(['form:submit'])

const showModal = defineModel('show', { default: false, type: Boolean })
</script>

<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">
          {{ perfilMedico === null ? 'Crear perfil médico' : 'Editando perfil médico' }}
        </div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm
          :entityValidationConfig="getPerfilMedicoValidatedFormConfig(perfilMedico)"
          @form:validated="$emit('form:submit', $event)"
        >
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="showModal = false" />
            <q-btn
              type="submit"
              color="primary"
              :label="perfilMedico === null ? 'Crear' : 'Actualizar'"
            />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
