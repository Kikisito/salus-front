<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { date, Loading, Notify } from 'quasar'
import AppointmentsCalendar from 'src/components/AppointmentsCalendar.vue'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const appointmentSlotStore = useAppointmentSlotStore()
const { slots } = storeToRefs(appointmentSlotStore)
const slotsLoaded = ref(false)

onMounted(async () => {
  await appointmentSlotStore.getDoctorAppointmentSlots(
    medicalProfile.value.id,
    date.formatDate(new Date(), 'YYYY-MM-DD'),
  )
  slotsLoaded.value = true
})

async function goToAppointment(appointmentSlot: AppointmentSlot) {
  if (appointmentSlot.appointmentId) {
    await router.push({
      name: 'professional-appointment',
      params: { id: appointmentSlot.appointmentId },
    })
  } else {
    Notify.create({
      type: 'warning',
      message: 'No hay ninguna cita programada en este hueco',
    })
  }
}

async function getData(d: string = new Date().toISOString()) {
  Loading.show({
    message: 'Cargando información...',
  })

  await appointmentSlotStore.getDoctorAppointmentSlots(
    medicalProfile.value.id,
    date.formatDate(d, 'YYYY-MM-DD'),
  )

  Loading.hide()
}
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div>
            <div class="text-h6">
              {{ medicalProfile.user.nombre }} {{ medicalProfile.user.apellidos }}
            </div>
            <div class="text-subtitle">Número de colegiado: {{ medicalProfile.license }}</div>

            <q-badge
              v-for="specialty in medicalProfile.specialties"
              :key="specialty.id"
              color="secondary"
              class="q-mr-xs q-mb-xs"
              text-color="white"
            >
              {{ specialty.name }}
            </q-badge>

            <q-badge v-if="medicalProfile.specialties?.length <= 0" color="grey" text-color="white">
              Sin especialidades
            </q-badge>
          </div>
        </div>

        <AppointmentsCalendar
          v-if="slotsLoaded"
          v-model:appointment-slots="slots"
          calendar-type="day"
          @appointment-slot:click="goToAppointment($event)"
          @update:model-value="getData($event)"
        />

        <div v-else class="text-center q-pa-xl">
          <q-spinner size="3em" color="primary" />
          <div class="text-subtitle1 q-mt-md">Cargando datos de la cita...</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="css" scoped>
.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
