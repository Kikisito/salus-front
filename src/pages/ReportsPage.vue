<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import PreviaInforme from 'src/components/PreviaInforme.vue'
import { useReportStore } from 'src/stores/ReportStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const reportStore = useReportStore()
const { reports } = storeToRefs(reportStore)

onMounted(async () => {
  if (user.value) {
    await reportStore.getUserReports(user.value.id)
  } else {
    console.error('No se pudo obtener el ID del usuario')
    Notify.create({
      type: 'negative',
      message: 'No se han podido cargar los informes médicos',
    })
  }
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Informes</div>
          <div class="text-subtitle">Visualiza tus informes médicos</div>
        </div>

        <PreviaInforme
          v-for="report in reports"
          :key="report.id"
          :report="report"
          @report:download="reportStore.downloadReportPdf($event)"
        />

        <div v-if="reports.length === 0" class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-body1">No tienes informes médicos disponibles.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
