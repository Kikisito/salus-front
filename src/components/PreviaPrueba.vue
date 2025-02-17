<script lang="ts" setup>
import { HeFilledMedicalSample, HeFilledXray } from '@kalimahapps/vue-icons'
import { ref } from 'vue'

const props = defineProps(['prueba'])

const expanded = ref(false)
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <HeFilledMedicalSample class="text-h4" v-if="props.prueba.type == 'Analítica'" />
          <HeFilledXray class="text-h4" v-else />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ props.prueba.especialidad }}</q-item-label>
          <q-item-label caption>{{ props.prueba.doctor }}</q-item-label>
          <q-item-label caption>Prueba realizada el {{ props.prueba.fecha }}</q-item-label>
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Descripción:</div>
        <div class="text-body2">
          {{ props.prueba.texto }}
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="q-mt-sm"
          label="Descargar informe de la prueba"
          color="primary"
          icon="download"
        />
      </q-card-actions>
    </q-expansion-item>
  </q-card>
</template>
