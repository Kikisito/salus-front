<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import PreviaReceta from 'src/components/PreviaReceta.vue'
import { usePrescriptionStore } from 'src/stores/PrescriptionStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const prescriptionStore = usePrescriptionStore()
const { prescriptions } = storeToRefs(prescriptionStore)

onMounted(async () => {
  if (user.value) {
    await prescriptionStore.getUserPrescriptions(user.value.id)
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
          <div class="text-h6">Recetas</div>
          <div class="text-subtitle">Visualiza todas tus recetas</div>
        </div>

        <PreviaReceta
          v-for="prescription in prescriptions"
          :key="prescription.id"
          :prescription="prescription"
          @prescription:download="prescriptionStore.downloadPrescriptionPdf(prescription)"
        />

        <div v-if="prescriptions.length === 0" class="q-mt-md">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-body1">No tienes recetas disponibles.</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
