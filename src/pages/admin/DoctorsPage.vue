<script lang="ts" setup>
import { Dialog, Loading, Notify } from 'quasar'
import DoctorsList from 'src/components/admin/DoctorsList.vue'
import GenerateSlotsFromDateRangeDialog from 'src/components/appointments/GenerateSlotsFromDateRangeDialog.vue'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'

const appointmentSlotStore = useAppointmentSlotStore()

async function generateSlotsByDateRangeDialog() {
  Dialog.create({
    component: GenerateSlotsFromDateRangeDialog,
    componentProps: {
      title: 'Generación de citas en un rango de fechas',
      persistent: true,
    },
  }).onOk(async (data) => {
    Loading.show({
      message: 'Generando citas...',
    })

    const response = await appointmentSlotStore.generateSlotsForAllDoctorsWithDateRange(
      data.startDate,
      data.endDate,
    )

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Huecos de cita generados correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }

    Loading.hide()
  })
}
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row justify-between items-center">
          <div>
            <div class="text-h6">Médicos</div>
            <div class="text-subtitle">Listado de médicos registrados</div>
          </div>
          <q-btn
            color="green"
            label="Generar huecos de citas"
            icon="calendar_today"
            @click="generateSlotsByDateRangeDialog()"
          />
        </div>

        <DoctorsList />
      </div>
    </div>
  </q-page>
</template>
