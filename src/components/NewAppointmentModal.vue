<script lang="ts" setup>
import { getCitaValidatedFormConfig } from 'src/config/CitaValidatedFormConfig'
import EntityValidatedForm from './EntityValidatedForm.vue'

defineEmits(['form:submit', 'form:cancel'])

const showDialog = defineModel({ default: false, type: Boolean })
</script>

<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Creando una nueva cita</div>
      </q-card-section>

      <q-card-section>
        <EntityValidatedForm :entityValidationConfig="getCitaValidatedFormConfig()">
          <template #submitButton>
            <q-btn color="primary" flat label="Cancelar" @click="$emit('form:cancel')" />
            <q-btn color="primary" label="Añadir" @click="$emit('form:submit')" />
          </template>
        </EntityValidatedForm>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
