<script lang="ts" setup>
import type { MedicalTest } from 'src/interfaces/MedicalTest'
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  test: {
    type: Object as PropType<MedicalTest>,
    required: true,
  },
})

defineEmits(['test:download'])

const expanded = ref(false)
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon name="analytics" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ props.test.specialty.name }}</q-item-label>
          <q-item-label caption>
            {{ props.test.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
            {{ props.test.doctor.user.nombre }} {{ props.test.doctor.user.apellidos }}
          </q-item-label>

          <q-item-label v-if="props.test.completedAt" caption>
            Prueba realizada el
            {{
              new Date(props.test.completedAt).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            }}
          </q-item-label>

          <q-item-label v-else-if="props.test.scheduledAt" caption>
            Prueba programada para el
            {{
              new Date(props.test.scheduledAt).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            }}
          </q-item-label>

          <q-item-label v-else caption>Prueba no programada</q-item-label>
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Descripción:</div>
        <div class="text-body2">
          {{ props.test.description }}
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="q-mt-sm"
          label="Descargar informe de la prueba"
          color="primary"
          icon="download"
          @click="$emit('test:download', props.test)"
        />
      </q-card-actions>
    </q-expansion-item>
  </q-card>
</template>
