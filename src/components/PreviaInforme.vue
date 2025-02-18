<script lang="ts" setup>
import { HeFilledRegisterBook } from '@kalimahapps/vue-icons'
import { ref } from 'vue'

const props = defineProps(['informe'])

const expanded = ref(false)
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <HeFilledRegisterBook class="text-h4" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ props.informe.especialidad }}</q-item-label>
          <q-item-label caption>{{ props.informe.doctor }}</q-item-label>
          <q-item-label caption>{{ props.informe.fecha }}</q-item-label>
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Informe:</div>
        <div class="text-body2">
          {{ props.informe.texto }}
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn class="q-mt-sm" label="Descargar informe completo" color="primary" icon="download" />
      </q-card-actions>
    </q-expansion-item>
  </q-card>
</template>
