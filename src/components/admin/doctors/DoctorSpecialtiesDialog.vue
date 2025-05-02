<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Loading, Notify, useDialogPluginComponent } from 'quasar'
import type { Specialty } from 'src/interfaces/Specialty'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import { useDoctorStore } from 'src/stores/DoctorStore'
import { useSpecialtyStore } from 'src/stores/SpecialtyStore'
import { onMounted, ref, toRef, type PropType } from 'vue'

const props = defineProps({
  medicalProfile: {
    type: Object as PropType<MedicalProfile>,
    required: true,
  },
})

const profile = toRef(() => props.medicalProfile)

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef } = useDialogPluginComponent()

const doctorStore = useDoctorStore()

const specialtiesStore = useSpecialtyStore()
const { specialties } = storeToRefs(specialtiesStore)

const filteredSpecialties = ref<Specialty[]>([])
const selectedSpecialty = ref<Specialty>(null as unknown as Specialty)

async function addSpecialty() {
  Loading.show({
    message: 'Añadiendo especialidad...',
  })

  // Añadimos la especialidad al perfil médico
  await doctorStore
    .addSpecialty(profile.value.id, selectedSpecialty.value.id)
    .then(() => {
      // Notificamos de éxito
      Notify.create({
        type: 'positive',
        message: 'Especialidad añadida correctamente',
      })

      // Añadimos la especialidad a la lista local
      profile.value.specialties.push(selectedSpecialty.value)

      // Actualizamos la lista de especialidades
      filteredSpecialties.value = specialties.value.filter((item) => {
        return !profile.value.specialties.some((especialidad) => especialidad.id === item.id)
      })
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: 'Error al añadir la especialidad',
      })
    })
    .finally(() => {
      Loading.hide()
    })

  // Limpiamos la selección
  selectedSpecialty.value = null as unknown as Specialty
}

async function removeSpecialty(specialtyId: number) {
  Loading.show({
    message: 'Eliminando especialidad...',
  })

  // Eliminamos la especialidad del perfil médico
  await doctorStore
    .removeSpecialty(profile.value.id, specialtyId)
    .then(() => {
      // Notificamos de éxito
      Notify.create({
        type: 'positive',
        message: 'Especialidad eliminada correctamente',
      })

      // Eliminamos la especialidad de la lista de especialidades local del perfil
      profile.value.specialties = profile.value.specialties.filter(
        (especialidad) => especialidad.id !== specialtyId,
      )

      // Actualizamos la lista de especialidades
      filteredSpecialties.value = specialties.value.filter(
        (especialidad) => especialidad.id !== specialtyId,
      )
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: 'Error al eliminar la especialidad',
      })
    })
    .finally(() => {
      Loading.hide()
    })

  // Limpiamos la selección
  selectedSpecialty.value = null as unknown as Specialty
}

// @ts-expect-error Método de Quasar
async function filterSpecialties(value, update) {
  const filter = (especialidad: Specialty) => {
    return especialidad.name.toLowerCase().includes(value.toLowerCase())
  }

  update(() => {
    filteredSpecialties.value = specialties.value.filter(filter).filter((item) => {
      return !profile.value.specialties.some((especialidad) => especialidad.id === item.id)
    })
  })
}

onMounted(async () => {
  // Cargamos las especialidades al abrir el diálogo
  Loading.show({
    message: 'Cargando especialidades...',
  })

  // Cargamos todas las especialidades
  await specialtiesStore.getAllSpecialties().then(() => {
    filteredSpecialties.value = specialties.value
  })

  Loading.hide()
})
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-toolbar-title>Especialidades</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <q-list separator dense>
          <q-item v-for="(specialty, index) in medicalProfile.specialties" :key="index">
            <q-item-section>
              <q-item-label>
                <q-avatar>
                  <q-icon name="medical_information" />
                </q-avatar>
                {{ specialty.name }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="red"
                label="Eliminar"
                icon="delete"
                size="sm"
                @click="removeSpecialty(specialty.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator />

        <div class="q-mt-md">
          <q-select
            v-model="selectedSpecialty"
            :options="filteredSpecialties"
            option-label="name"
            label="Añadir especialidad"
            use-input
            hide-selected
            fill-input
            input-debounce="300"
            @filter="filterSpecialties"
            class="q-mb-md"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se encontraron especialidades
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="flex justify-end">
            <q-btn
              color="primary"
              label="Añadir"
              :disable="!selectedSpecialty"
              @click="addSpecialty()"
            />
          </div>
        </div>
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
