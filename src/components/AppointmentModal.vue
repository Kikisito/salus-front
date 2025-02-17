<script lang="ts" setup>
import { getCitaValidatedFormConfig } from 'src/config/CitaValidatedFormConfig'
import EntityValidatedForm from './EntityValidatedForm.vue'

defineProps({
  appointment: {
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
          {{ appointment === null ? 'Solicitando nueva cita' : 'Editando cita' }}
        </div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm
          :entityValidationConfig="getCitaValidatedFormConfig(appointment)"
          @form:validated="$emit('form:submit')"
        >
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="showModal = false" />
            <q-btn
              type="submit"
              color="primary"
              :label="appointment === null ? 'Crear' : 'Actualizar'"
            />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
