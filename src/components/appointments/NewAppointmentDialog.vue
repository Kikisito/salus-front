<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import NewAppointmentStepperForm from './NewAppointmentStepperForm.vue'
import type { PropType } from 'vue'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { Specialty } from 'src/interfaces/Specialty'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'

defineProps({
  getSpecialties: {
    type: Function as PropType<(search?: string) => Promise<Specialty[]>>,
    required: true,
  },
  getMedicalCenters: {
    type: Function as PropType<(specialty: Specialty, search?: string) => Promise<MedicalCenter[]>>,
    required: true,
  },
  getDoctors: {
    type: Function as PropType<
      (
        medicalCenter: MedicalCenter,
        specialty: Specialty,
        search?: string,
      ) => Promise<MedicalProfile[]>
    >,
    required: true,
  },
  getAvailableSlots: {
    type: Function as PropType<
      (
        medicalCenter: MedicalCenter,
        specialty: Specialty,
        doctor: MedicalProfile,
        date: Date,
      ) => Promise<AppointmentSlot[]>
    >,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="event" />
        </q-avatar>

        <q-toolbar-title>Nueva cita</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <NewAppointmentStepperForm
          :get-specialties="getSpecialties"
          :get-medical-centers="getMedicalCenters"
          :get-doctors="getDoctors"
          :get-available-slots="getAvailableSlots"
          @form:cancel="dialogRef?.hide()"
          @form:submit="onDialogOK($event)"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.q-card {
  width: 700px;
  max-width: 80vw;
}
</style>
