<script lang="ts" setup>
import type { Report } from 'src/interfaces/Report'
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  report: {
    type: Object as PropType<Report>,
    required: true,
  },
})

defineEmits(['report:download'])

const expanded = ref(false)
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon name="description" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ props.report.description }}</q-item-label>
          <q-item-label caption>{{ props.report.specialty.name }}</q-item-label>
          <q-item-label caption>{{
            new Date(props.report.createdAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          }}</q-item-label>
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Diagnóstico:</div>
        <div class="text-body2">
          {{ props.report.diagnosis }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">Tratamiento:</div>
        <div class="text-body2">
          {{ props.report.treatment }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">Observaciones:</div>
        <div class="text-body2">
          {{ props.report.observations }}
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="q-mt-sm"
          label="Descargar informe completo"
          color="primary"
          icon="download"
          @click="$emit('report:download', props.report)"
        />
      </q-card-actions>
    </q-expansion-item>
  </q-card>
</template>
