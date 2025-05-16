<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Notify } from 'quasar'
import PreviaReceta from 'src/components/PreviaReceta.vue'
import { usePrescriptionStore } from 'src/stores/PrescriptionStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'
import { Network } from '@capacitor/network'

const loading = ref(true)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const prescriptionStore = usePrescriptionStore()
const { prescriptions } = storeToRefs(prescriptionStore)

onMounted(async () => {
  const networkStatus = await Network.getStatus()

  if (networkStatus.connected) {
    if (user.value) {
      await prescriptionStore.getUserPrescriptions(user.value.id)
    } else {
      console.error('No se pudo obtener el ID del usuario')
      Notify.create({
        type: 'negative',
        message: 'No se han podido cargar las recetas',
      })
    }
  } else {
    Notify.create({
      message:
        'No tienes conexión a internet. Los informes que se muestran pueden no estar actualizados.',
      type: 'negative',
    })
  }

  loading.value = false
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
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

    <div v-else class="q-pa-md">
      <div class="text-center q-pa-xl">
        <q-spinner size="3em" color="primary" />
        <div class="text-subtitle1 q-mt-md">Cargando...</div>
      </div>
    </div>
  </q-page>
</template>
