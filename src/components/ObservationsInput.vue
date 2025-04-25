<script lang="ts" setup>
const observations = defineModel('observations', {
  type: String,
  default: '',
})

const loading = defineModel('loading', {
  type: Boolean,
  default: false,
})

const saved = defineModel('saved', {
  type: Boolean,
  default: false,
})

defineEmits(['observations:update'])
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center">
        <q-icon name="edit_note" class="q-mr-sm" />
        <div class="text-h6">Observaciones de la consulta</div>
      </div>
      <q-separator class="q-my-sm" />

      <q-input
        v-model="observations"
        type="textarea"
        rows="4"
        outlined
        placeholder="Escribe aquí las notas de la consulta..."
        @update:model-value="saved = false"
      />

      <div class="text-caption text-grey q-mt-xs">
        Estas observaciones no son visibles por el paciente y solo son para uso interno.
      </div>
      <div class="row justify-end items-center q-mt-sm">
        <q-badge
          class="q-mr-md"
          :color="saved ? 'positive' : 'warning'"
          :label="saved ? 'Guardado' : 'No guardado'"
        />
        <div class="row justify-end q-mt-sm">
          <q-btn
            color="primary"
            label="Guardar"
            icon="save"
            :loading="loading"
            :disable="saved"
            @click="$emit('observations:update', observations)"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
