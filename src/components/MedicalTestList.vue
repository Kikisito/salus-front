<script lang="ts" setup>
import type { MedicalTest } from 'src/interfaces/MedicalTest'
import type { PropType } from 'vue'

defineProps({
  medicalTests: {
    type: Object as PropType<MedicalTest[]>,
    required: true,
  },
})

defineEmits([
  'medicaltest:new',
  'medicaltest:show',
  'medicaltest:download_pdf',
  'medicaltest:edit',
  'medicaltest:delete',
])
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center">
        <q-icon name="science" class="q-mr-sm" />
        <div class="text-h6">Pruebas médicas</div>
        <q-space />
        <q-btn color="primary" icon="add" round size="sm" @click="$emit('medicaltest:new')" />
      </div>
      <q-separator class="q-my-sm" />

      <template v-if="medicalTests.length">
        <q-list separator>
          <q-item v-for="medicalTest in medicalTests" :key="medicalTest.id">
            <q-item-section>
              <q-item-label>{{ medicalTest.name }}</q-item-label>
              <q-item-label caption>
                Fechado a
                {{
                  new Date(medicalTest.createdAt).toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div>
                <q-btn
                  icon="visibility"
                  flat
                  round
                  @click="$emit('medicaltest:show', medicalTest)"
                />
                <q-btn
                  icon="download"
                  flat
                  round
                  @click="$emit('medicaltest:download_pdf', medicalTest)"
                />
                <q-btn icon="delete" flat round @click="$emit('medicaltest:delete', medicalTest)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <div v-else class="text-center q-pa-md text-grey">No hay pruebas médicas disponibles</div>
    </q-card-section>
  </q-card>
</template>
