<script lang="ts" setup>
import { HeFilledRegisterBook } from '@kalimahapps/vue-icons'
import type { Report } from 'src/interfaces/Report'
import type { PropType } from 'vue'

defineProps({
  reports: {
    type: Object as PropType<Report[]>,
    required: true,
  },
})

defineEmits(['report:new', 'report:show', 'report:download_pdf', 'report:edit', 'report:delete'])
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center">
        <HeFilledRegisterBook class="q-mr-sm" />
        <div class="text-h6">Informes médicos</div>
        <q-space />
        <q-btn color="primary" icon="add" round size="sm" @click="$emit('report:new')" />
      </div>
      <q-separator class="q-my-sm" />

      <template v-if="reports.length">
        <q-list separator>
          <q-item v-for="report in reports" :key="report.id">
            <q-item-section>
              <q-item-label>{{ report.description }}</q-item-label>
              <q-item-label caption>
                Fechado a
                {{
                  new Date(report.createdAt).toLocaleString(undefined, {
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
                <q-btn icon="visibility" flat round @click="$emit('report:show', report)" />
                <q-btn icon="download" flat round @click="$emit('report:download_pdf', report)" />
                <q-btn icon="edit" flat round @click="$emit('report:edit', report)" />
                <q-btn icon="delete" flat round @click="$emit('report:delete', report.id)" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <div v-else class="text-center q-pa-md text-grey">No hay informes médicos disponibles</div>
    </q-card-section>
  </q-card>
</template>
