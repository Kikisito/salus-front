<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { useMedicalCenterStore } from 'src/stores/MedicalCenterStore'
import { useSpecialtyStore } from 'src/stores/SpecialtyStore'
import { useUsersStore } from 'src/stores/UsersStore'
import { storeToRefs } from 'pinia'

const loading = ref(true)

const usersStore = useUsersStore()
const { count: userCount } = storeToRefs(usersStore)

const doctorStore = useDoctorStore()
const { count: doctorCount } = storeToRefs(doctorStore)

const medicalCenterStore = useMedicalCenterStore()
const { count: centerCount } = storeToRefs(medicalCenterStore)

const specialtyStore = useSpecialtyStore()
const { count: specialtyCount } = storeToRefs(specialtyStore)

const buttons = [
  {
    title: 'Gestionar usuarios',
    caption: 'Crea, modifica o bloquea usuarios',
    icon: 'person_add',
    color: 'primary',
    route: 'admin-patients',
  },
  {
    title: 'Gestionar médicos',
    caption: 'Administra los profesionales del sistema',
    icon: 'medical_information',
    color: 'green',
    route: 'admin-doctors',
  },
  {
    title: 'Gestionar centros',
    caption: 'Administra los centros médicos',
    icon: 'location_on',
    color: 'amber',
    route: 'admin-medical-centers',
  },
  {
    title: 'Gestionar especialidades',
    caption: 'Administra las especialidades médicas',
    icon: 'medical_services',
    color: 'purple',
    route: 'admin-specialties',
  },
  {
    title: 'Nueva cita',
    caption: 'Programa una cita para un paciente',
    icon: 'event',
    color: 'red',
    route: 'admin-patients',
  },
  {
    title: 'Volver al panel personal',
    caption: 'Regresa a tu perfil de usuario',
    icon: 'arrow_back',
    color: 'grey',
    route: 'home',
  },
]

onMounted(async () => {
  try {
    await usersStore.getAllUsers(0, 1)
    await doctorStore.getAll(0, 1)
    await medicalCenterStore.getAllMedicalCenters(0, 1)
    await specialtyStore.getAllSpecialties(0, 1)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h5">Panel de Administración</div>
          <div class="text-subtitle">Bienvenido al centro de gestión de la aplicación</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="bg-blue-1 q-pl-sm q-pr-sm" flat bordered>
              <q-card-section>
                <div class="text-h6">Usuarios</div>
                <div class="text-h3 text-weight-bold text-primary q-mt-sm">{{ userCount }}</div>
                <q-icon
                  name="people"
                  size="3rem"
                  class="absolute-bottom-right q-ma-sm opacity-50"
                />
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  color="primary"
                  label="Ver usuarios"
                  @click="$router.push({ name: 'admin-patients' })"
                />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="bg-green-1 q-pl-sm q-pr-sm" flat bordered>
              <q-card-section>
                <div class="text-h6">Profesionales</div>
                <div class="text-h3 text-weight-bold text-green q-mt-sm">{{ doctorCount }}</div>
                <q-icon
                  name="medical_services"
                  size="3rem"
                  class="absolute-bottom-right q-ma-sm opacity-50"
                />
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  color="green"
                  label="Ver médicos"
                  @click="$router.push({ name: 'admin-doctors' })"
                />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="bg-pink-1 q-pl-sm q-pr-sm" flat bordered>
              <q-card-section>
                <div class="text-h6">Centros médicos</div>
                <div class="text-h3 text-weight-bold text-pink q-mt-sm">{{ centerCount }}</div>
                <q-icon
                  name="domain"
                  size="3rem"
                  class="absolute-bottom-right q-ma-sm opacity-50"
                />
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  color="pink"
                  label="Ver centros"
                  @click="$router.push({ name: 'admin-medical-centers' })"
                />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="bg-purple-1 q-pl-sm q-pr-sm" flat bordered>
              <q-card-section>
                <div class="text-h6">Especialidades</div>
                <div class="text-h3 text-weight-bold text-purple q-mt-sm">{{ specialtyCount }}</div>
                <q-icon
                  name="medical_services"
                  size="3rem"
                  class="absolute-bottom-right q-ma-sm opacity-50"
                />
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  color="purple"
                  label="Ver especialidades"
                  @click="$router.push({ name: 'admin-specialties' })"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="q-mt-lg">
          <div class="text-h6">Accesos directos</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4" v-for="(action, index) in buttons" :key="index">
            <q-card
              class="cursor-pointer q-card-selectable"
              v-ripple
              flat
              bordered
              @click="$router.push({ name: action.route })"
            >
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ action.title }}</div>
                    <div class="text-caption">{{ action.caption }}</div>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      round
                      :color="action.color"
                      :icon="action.icon"
                      @click="$router.push({ name: action.route })"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-spinner size="3em" color="primary" />
      <div class="text-subtitle1 q-mt-md">Cargando...</div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header {
  margin-bottom: 16px;
}
</style>
