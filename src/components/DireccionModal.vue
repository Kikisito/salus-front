<script lang="ts" setup>
import EntityValidatedForm from './EntityValidatedForm.vue'
import { getDireccionValidatedFormConfig } from 'src/config/DireccionFormConfig'

defineProps({
  direccion: {
    type: Object,
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
          {{ direccion === null ? 'Nueva dirección' : 'Editando dirección' }}
        </div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm
          :entityValidationConfig="getDireccionValidatedFormConfig(direccion)"
          @form:validated="$emit('form:submit', $event)"
        >
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="showModal = false" />
            <q-btn
              type="submit"
              color="primary"
              :label="direccion === null ? 'Crear' : 'Actualizar'"
            />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
