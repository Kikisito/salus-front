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
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Creando una nueva cita</div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm
          :entityValidationConfig="getCitaValidatedFormConfig(appointment || null)"
          @form:validated="$emit('form:submit')"
        >
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="showModal = false" />
            <q-btn type="submit" color="primary" label="Añadir" />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
