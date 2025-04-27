<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'

import PatientData from 'src/components/PatientData.vue'
import DireccionDetails from 'src/components/DireccionDetails.vue'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useUsersStore } from 'src/stores/admin/UsersStore'
import type { User } from 'src/interfaces/User'
import type { Appointment } from 'src/interfaces/Appointment'
import { useUserStore } from 'src/stores/UserStore'
import { storeToRefs } from 'pinia'
import AppointmentsHistory from 'src/components/AppointmentsHistory.vue'

const route = useRoute()
const router = useRouter()

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const userId = parseInt(route.params.id as string)
const usersStore = useUsersStore()
const appointmentStore = useAppointmentStore()

const patient = ref<User | null>(null)
const appointments = ref<Appointment[]>([])
const loading = ref(true)
const appointmentsLoading = ref(true)
const tab = ref('info')

async function loadPatientData() {
  loading.value = true

  try {
    const response = await usersStore.getUserData(userId)

    if (response.success) {
      patient.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error || 'Error al cargar los datos del paciente',
      })
      router.push({ name: 'professional-patients' })
    }
  } catch (error) {
    console.error('Error al cargar el paciente:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los datos del paciente',
    })
  } finally {
    loading.value = false
  }
}

async function loadPatientAppointments() {
  appointmentsLoading.value = true

  try {
    const response = await appointmentStore.getPatientAppointmentsWithDoctorOrItsSpecialties(
      userId,
      medicalProfile.value.id,
    )

    if (response.success) {
      appointments.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  } finally {
    appointmentsLoading.value = false
  }
}

onMounted(async () => {
  await loadPatientData()
  await loadPatientAppointments()
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div v-if="patient">
            <div class="text-h6">{{ patient.nombre }} {{ patient.apellidos }}</div>
            <div class="text-subtitle">Perfil del paciente</div>
          </div>
        </div>

        <template v-if="loading">
          <div class="text-center q-pa-md">
            <q-spinner size="3em" color="primary" />
            <div class="text-subtitle1 q-mt-md">Cargando datos del paciente...</div>
          </div>
        </template>

        <template v-else-if="patient">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="info" label="Información" icon="person" />
            <q-tab name="history" label="Historial médico" icon="history" />
            <q-tab name="appointments" label="Citas" icon="event" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Tab información del paciente -->
            <q-tab-panel name="info">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <PatientData :patient="patient" />
                </div>
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="row items-center">
                        <q-icon name="home" class="q-mr-sm" />
                        <div class="text-h6">Dirección</div>
                      </div>
                      <q-separator class="q-my-sm" />
                      <DireccionDetails :direccion="patient.direccion" />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- Tab historial médico -->
            <q-tab-panel name="history">
              <q-card flat bordered>
                <q-card-section>
                  <div class="row items-center">
                    <q-icon name="medical_information" class="q-mr-sm" />
                    <div class="text-h6">Historial médico</div>
                  </div>
                  <q-separator class="q-my-sm" />

                  <!-- Aquí iría el historial médico del paciente cuando esté disponible -->
                  <div class="text-center q-py-lg text-grey">
                    <q-icon name="history" size="4em" />
                    <p>El historial médico estará disponible próximamente</p>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Tab histórico de citas -->
            <q-tab-panel name="appointments">
              <AppointmentsHistory
                :appointments="appointments"
                :loading="appointmentsLoading"
                @appointment:show="
                  $router.push({
                    name: 'professional-appointment',
                    params: { id: $event.id },
                  })
                "
              />

              <div class="text-grey text-caption">
                Las citas mostradas corresponden a las citas médicas que el paciente ha tenido
                contigo o alguna de tus especialidades.
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

        <template v-else>
          <q-banner inline-actions class="text-white bg-red">
            <template v-slot:avatar>
              <q-icon name="error" />
            </template>
            <span>
              No se ha podido cargar la información del paciente. Por favor, inténtalo de nuevo más
              tarde.
            </span>
            <template v-slot:action>
              <q-btn
                flat
                label="Volver al listado de pacientes"
                @click="$router.push({ name: 'professional-patients' })"
              />
            </template>
          </q-banner>
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header {
  margin-bottom: 16px;
}

.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
