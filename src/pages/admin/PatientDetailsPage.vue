<script lang="ts" setup>
import UserDetails from 'src/components/UserDetails.vue'

import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUsersStore } from 'src/stores/UsersStore'
import { storeToRefs } from 'pinia'
import DireccionDetails from 'src/components/DireccionDetails.vue'
import { Dialog, Notify } from 'quasar'
import type { Direccion } from 'src/interfaces/Direccion'
import type { User } from 'src/interfaces/User'
import ProfileChangeUserDataModal from 'src/components/ProfileChangeUserDataModal.vue'
import DireccionModal from 'src/components/DireccionModal.vue'
import NewAppointmentDialog from 'src/components/appointments/NewAppointmentDialog.vue'
import { useMedicalCenterStore } from 'src/stores/MedicalCenterStore'
import { useSpecialtyStore } from 'src/stores/SpecialtyStore'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { useAppointmentSlotStore } from 'src/stores/AppointmentSlotStore'
import type { Specialty } from 'src/interfaces/Specialty'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import type { AppointmentRequest } from 'src/interfaces/AppointmentRequest'
import { useAppointmentStore } from 'src/stores/AppointmentStore'

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()
const { inspectedUser } = storeToRefs(usersStore)

const rawUserId: string = route.params.id as string
const userId = parseInt(rawUserId)

const showUserDataModal = ref(false)
const showDireccionModal = ref(false)

const loading = ref(false)

async function getUserData() {
  loading.value = true
  if (userId) {
    await usersStore.getUserData(userId)
  } else {
    console.error('El ID del usuario no es válido. No se ha podido convertir a número.')
  }
  loading.value = false
}

async function updateProfile(user: User) {
  const response = await usersStore.updateProfile(userId, user)

  if (response.success) {
    Notify.create({
      message: 'Perfil actualizado correctamente',
      color: 'positive',
      icon: 'check',
    })
    showUserDataModal.value = false
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}

async function setDireccion(direccion: Direccion) {
  const response = await usersStore.setAddress(userId, direccion)
  if (response.success) {
    Notify.create({
      message: 'Dirección actualizada correctamente',
      color: 'positive',
      icon: 'check',
    })
    showDireccionModal.value = false
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}

async function restrictUser(userId: number, restrict: boolean) {
  const response = await usersStore.restrictUser(userId, restrict)
  if (response.success) {
    Notify.create({
      message: `El usuario ha sido ${restrict ? 'bloqueado' : 'desbloqueado'} correctamente`,
      color: 'positive',
      icon: 'check',
    })
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}

async function openMedicalProfileDialog() {
  Dialog.create({
    title: 'Convertir en profesional',
    message: 'Para convertir al usuario en profesional, introduce su número de colegiado',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val) => !!val,
      label: 'Número de colegiado',
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data) => {
    const response = await usersStore.convertToProfessional(userId, data)
    if (response.success) {
      // Notificación de éxito
      Notify.create({
        message: 'El usuario ha sido convertido a profesional correctamente',
        color: 'positive',
        icon: 'check',
      })

      // Redirección al perfil del nuevo médico
      if (response.data) {
        router.push({
          name: 'admin-doctor',
          params: { id: response.data.id },
        })
      }
    } else {
      Notify.create({
        message: response.error,
        color: 'negative',
        icon: 'error',
      })
    }
  })
}
// Métodos auxiliares para el modal de creación de citas
const medicalCenterStore = useMedicalCenterStore()
const specialtyStore = useSpecialtyStore()
const doctorStore = useDoctorStore()
const appointmentSlotStore = useAppointmentSlotStore()
const appointmentStore = useAppointmentStore()

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
// Fin de métodos auxiliares

async function openCreateAppointmentDialog() {
  Dialog.create({
    component: NewAppointmentDialog,
    componentProps: {
      getMedicalCenters: getMedicalCenters,
      getSpecialties: getSpecialties,
      getDoctors: getDoctors,
      getAvailableSlots: getAppointmentSlots,
    },
  }).onOk(async (request: AppointmentRequest) => {
    // Asignamos el ID del paciente a la cita
    request.patient = userId

    const response = await appointmentStore.createAppointment(request)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Cita creada con éxito',
      })

      // Redirigir al administrador a los detalles de la cita
      router.push({
        name: 'admin-doctor-appointment',
        params: { id: response.data.slot.doctor.id, appointmentId: response.data.id },
      })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  })
}

onMounted(async () => {
  await getUserData()
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div>
            <div class="text-h6">Perfil del usuario</div>
            <div class="text-subtitle">Revisa los datos asociados a un usuario</div>
          </div>
          <q-space />
          <q-btn-dropdown
            v-if="inspectedUser"
            label="Acciones"
            color="primary"
            icon="settings"
            rounded
          >
            <q-list>
              <!-- Crear cita -->
              <q-item clickable v-close-popup @click="openCreateAppointmentDialog()">
                <q-item-section avatar>
                  <q-avatar icon="event" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Crear cita</q-item-label>
                  <q-item-label caption>Crear una nueva cita para el usuario</q-item-label>
                </q-item-section>
              </q-item>

              <!-- Bloqueo de citas -->
              <q-item
                clickable
                v-close-popup
                @click="restrictUser(userId, !inspectedUser.restricted)"
              >
                <q-item-section avatar>
                  <q-avatar icon="lock" v-if="!inspectedUser.restricted" />
                  <q-avatar icon="lock_open" v-else />
                </q-item-section>

                <q-item-section v-if="!inspectedUser.restricted">
                  <q-item-label>Bloquear citas</q-item-label>
                  <q-item-label caption>El usuario no podrá solicitar nuevas citas</q-item-label>
                </q-item-section>
                <q-item-section v-else>
                  <q-item-label>Desbloquear citas</q-item-label>
                  <q-item-label caption>
                    El usuario podrá volver a solicitar nuevas citas
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!-- Gestión de perfil profesional -->
              <q-item clickable v-close-popup @click="openMedicalProfileDialog()">
                <q-item-section avatar>
                  <q-avatar icon="person_add" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Convertir en profesional</q-item-label>
                  <q-item-label caption>El usuario podrá entrar como médico</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <template v-if="inspectedUser">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="row section-header">
                <div class="text-h6">Datos básicos</div>
                <q-space />
                <q-chip
                  v-if="inspectedUser"
                  color="primary"
                  text-color="white"
                  label="Editar"
                  icon="edit"
                  clickable
                  @click="showUserDataModal = true"
                />
              </div>
              <q-card flat bordered>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar text-color="white" style="background-color: #26a69a">
                      {{ inspectedUser.nombre?.charAt(0) }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      {{ inspectedUser.nombre }} {{ inspectedUser.apellidos }}
                    </q-item-label>
                    <q-item-label caption>{{ inspectedUser.email }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-card-section>
                  <UserDetails :user="inspectedUser">
                    <template #extraFields>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Bloqueo de citas</q-item-label>
                          <q-item-label>{{
                            inspectedUser.restricted
                              ? 'El usuario no puede crear citas'
                              : 'El usuario puede crear citas por sí mismo'
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </UserDetails>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <div class="row section-header">
                <div class="text-h6">Dirección asociada</div>
                <q-space />
                <q-chip
                  v-if="inspectedUser"
                  color="primary"
                  text-color="white"
                  label="Editar"
                  icon="edit"
                  clickable
                  @click="showDireccionModal = true"
                />
              </div>
              <q-card flat bordered>
                <q-card-section>
                  <DireccionDetails :direccion="inspectedUser.direccion" />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <ProfileChangeUserDataModal
            v-model:show="showUserDataModal"
            :user="inspectedUser"
            @form:submit="updateProfile($event)"
          />

          <DireccionModal
            v-model:show="showDireccionModal"
            :direccion="inspectedUser.direccion"
            @form:submit="setDireccion($event)"
          />
        </template>

        <q-card v-else-if="loading">
          <q-card-section>
            <span>Cargando...</span>
          </q-card-section>
        </q-card>

        <q-card v-else>
          <q-card-section>
            <span>No se ha podido cargar la información del perfil.</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
