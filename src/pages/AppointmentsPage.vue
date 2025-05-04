<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Dialog, Notify } from 'quasar'
import NewAppointmentDialog from 'src/components/appointments/NewAppointmentDialog.vue'
import PreviaCita from 'src/components/PreviaCita.vue'
import type { Appointment } from 'src/interfaces/Appointment'
import type { AppointmentRequest } from 'src/interfaces/AppointmentRequest'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import type { Specialty } from 'src/interfaces/Specialty'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { useMedicalCenterStore } from 'src/stores/MedicalCenterStore'
import { useSpecialtyStore } from 'src/stores/SpecialtyStore'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const loading = ref(true)

const appointmentStore = useAppointmentStore()
const { appointments } = storeToRefs(appointmentStore)
const pastAppointments = ref<Appointment[]>([])

const medicalCenterStore = useMedicalCenterStore()
const specialtyStore = useSpecialtyStore()
const doctorStore = useDoctorStore()
const appointmentSlotStore = useAppointmentSlotStore()

async function getSpecialties(search?: string): Promise<Specialty[]> {
  let response
  if (search) {
    response = await specialtyStore.searchSpecialties(search)
  } else {
    response = await specialtyStore.getAllSpecialties(0, 50)
  }

  if (response.success) {
    return response.data
  } else {
    Notify.create({
      message: 'Error al cargar las especialidades',
      color: 'negative',
    })
    return []
  }
}

async function getMedicalCenters(specialty: Specialty, search?: string): Promise<MedicalCenter[]> {
  let response

  if (search) {
    response = await medicalCenterStore.searchAvailableMedicalCenters(search, specialty)
  } else {
    response = await medicalCenterStore.getAvailableMedicalCenters(specialty)
  }

  if (response.success) {
    return response.data
  } else {
    Notify.create({
      message: 'Error al cargar los centros médicos',
      color: 'negative',
    })
    return []
  }
}

async function getDoctors(
  medicalCenter: MedicalCenter,
  specialty: Specialty,
): Promise<MedicalProfile[]> {
  const response = await doctorStore.getAvailableDoctors(medicalCenter, specialty)

  if (response.success) {
    return response.data
  } else {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los médicos',
    })
    return []
  }
}

async function getAppointmentSlots(
  medicalCenter: MedicalCenter,
  specialty: Specialty,
  doctor: MedicalProfile,
): Promise<AppointmentSlot[]> {
  const response = await appointmentSlotStore.getDoctorAndSpecialtyAvailableAppointmentSlots(
    medicalCenter,
    specialty,
    doctor,
  )

  if (response.success) {
    return response.data
  } else {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los horarios disponibles',
    })
    return []
  }
}

async function newAppointment() {
  Dialog.create({
    component: NewAppointmentDialog,
    componentProps: {
      getMedicalCenters: getMedicalCenters,
      getSpecialties: getSpecialties,
      getDoctors: getDoctors,
      getAvailableSlots: getAppointmentSlots,
    },
  }).onOk(async (request: AppointmentRequest) => {
    request.patient = user.value!.id!

    const response = await appointmentStore.createUserSessionAppointment(request)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Cita creada con éxito',
      })
      await appointmentStore.getAppointments()
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al crear la cita',
      })
    }
  })
}

async function showPastAppointments() {
  const response = await appointmentStore.getPastAppointments()
  if (response.success) {
    pastAppointments.value = response.data
  } else {
    Notify.create({
      message: 'Error al cargar las citas pasadas',
      color: 'negative',
      position: 'top',
    })
  }
}

onMounted(async () => {
  await appointmentStore.getAppointments().finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Tus próximas citas</div>
          <div class="text-subtitle">Consulta tus próximas citas</div>
        </div>

        <template v-if="appointments.length > 0">
          <PreviaCita
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            @appointment:show="$router.push({ name: 'appointment', params: { id: $event.id } })"
          />
        </template>

        <template v-else>
          <q-card flat bordered class="text-center q-pa-lg">
            <div>
              <q-icon name="event_busy" color="grey-7" size="5em" />
            </div>
            <div class="text-h6 q-mt-md">No tienes citas programadas</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Cuando reserves una cita con tu médico, aparecerá aquí
            </div>
            <q-btn
              color="primary"
              label="Solicitar una cita"
              class="q-mt-lg"
              icon="add_circle"
              size="large"
              @click="newAppointment()"
            />
          </q-card>
        </template>

        <div class="text-caption text-center">
          <q-btn
            v-if="pastAppointments.length === 0"
            color="primary"
            flat
            label="Ver citas antiguas"
            @click="showPastAppointments()"
          />
        </div>

        <template v-if="pastAppointments.length > 0">
          <div class="section-header q-mt-lg">
            <div class="text-h6">Citas antiguas</div>
          </div>

          <PreviaCita
            v-for="appointment in pastAppointments"
            class="bg-red-1"
            :key="appointment.id"
            :appointment="appointment"
            @appointment:show="$router.push({ name: 'appointment', params: { id: $event.id } })"
          />
        </template>
      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" class="bg-primary text-white" @click="newAppointment()" />
      </q-page-sticky>
    </div>

    <div v-else class="q-pa-md">
      <div class="text-center q-pa-xl">
        <q-spinner size="3em" color="primary" />
        <div class="text-subtitle1 q-mt-md">Cargando...</div>
      </div>
    </div>
  </q-page>
</template>
