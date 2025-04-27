<script lang="ts" setup>
import { HeFilledMedicines } from '@kalimahapps/vue-icons'
import type { Prescription } from 'src/interfaces/Prescription'
import type { PropType } from 'vue'

defineProps({
  prescriptions: {
    type: Object as PropType<Prescription[]>,
    required: true,
  },
})

defineEmits([
  'prescription:new',
  'prescription:show',
  'prescription:edit',
  'prescription:download_pdf',
  'prescription:delete',
])
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center">
        <HeFilledMedicines class="q-mr-sm" />
        <div class="text-h6">Recetas</div>
        <q-space />
        <q-btn color="primary" icon="add" round size="sm" @click="$emit('prescription:new')" />
      </div>
      <q-separator class="q-my-sm" />

      <template v-if="prescriptions.length">
        <q-list separator>
          <q-item v-for="prescription in prescriptions" :key="prescription.id">
            <q-item-section>
              <q-item-label>
                Receta creada el
                {{
                  new Date(prescription.createdAt).toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </q-item-label>
              <q-item-label caption>
                {{ prescription.medications.map((m) => m.name).join(', ') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div>
                <q-btn
                  icon="visibility"
                  flat
                  round
                  @click="$emit('prescription:show', prescription)"
                />
                <q-btn
                  icon="download"
                  flat
                  round
                  @click="$emit('prescription:download_pdf', prescription)"
                />
                <q-btn icon="edit" flat round @click="$emit('prescription:edit', prescription)" />
                <q-btn
                  icon="delete"
                  flat
                  round
                  @click="$emit('prescription:delete', prescription)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <div v-else class="text-center q-pa-md text-grey">No hay recetas disponibles</div>
    </q-card-section>
  </q-card>
</template>
