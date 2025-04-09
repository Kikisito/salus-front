<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { RawRoom } from 'src/interfaces/RawRoom'
import type { Room } from 'src/interfaces/Room'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import { ref, type PropType, onMounted } from 'vue'

const props = defineProps({
  room: {
    type: Object as PropType<Room>,
    required: false,
    default: null,
  },
  getAllMedicalCenters: {
    type: Function as PropType<
      (page: number, limit: number) => Promise<ServiceAnswer<MedicalCenter[] | null>>
    >,
    required: true,
  },
  searchMedicalCenters: {
    type: Function as PropType<
      (
        search: string,
        page: number,
        limit: number,
      ) => Promise<ServiceAnswer<MedicalCenter[] | null>>
    >,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const room = ref<RawRoom>({
  id: props.room?.id || 0,
  nombre: props.room?.nombre || '',
  centroMedico: props.room?.centroMedico?.id || (null as unknown as number),
})

// Lista de centros médicos para el select
const medicalCenters = ref<MedicalCenter[]>([])
const medicalCentersIsLoading = ref(false)

// Cargar centros médicos iniciales
onMounted(async () => {
  await loadMedicalCenters()
})

const loadMedicalCenters = async () => {
  medicalCentersIsLoading.value = true
  try {
    const response = await props.getAllMedicalCenters(0, 20)
    if (response.success) {
      medicalCenters.value = response.data as MedicalCenter[]
    } else {
      console.error('Error al cargar los centros médicos:', response.error)
    }
  } catch (error) {
    console.error('Error al cargar los centros médicos:', error)
  } finally {
    medicalCentersIsLoading.value = false
  }
}

// Filtrado centros médicos
const filterMedicalCenters = async (val: string, update: (callback: () => void) => void) => {
  update(async () => {
    medicalCentersIsLoading.value = true
    try {
      let response
      if (val === '') {
        response = await props.getAllMedicalCenters(0, 20)
      } else {
        response = await props.searchMedicalCenters(val, 0, 20)
      }

      if (response.success) {
        medicalCenters.value = response.data as MedicalCenter[]
      } else {
        console.error('Error al filtrar centros médicos:', response.error)
      }
    } catch (error) {
      console.error('Error al buscar centros médicos:', error)
    } finally {
      medicalCentersIsLoading.value = false
    }
  })
}
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="meeting_room" />
        </q-avatar>

        <q-toolbar-title>Consulta</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="onDialogOK(room)">
          <q-select
            filled
            v-model="room.centroMedico"
            :options="medicalCenters"
            option-value="id"
            option-label="nombre"
            label="Centro Médico"
            use-input
            input-debounce="300"
            class="q-mb-md"
            :rules="[(val) => !!val || 'El centro médico es obligatorio']"
            @filter="filterMedicalCenters"
            :loading="medicalCentersIsLoading"
            emit-value
            map-options
            clearable
          />

          <q-input
            filled
            v-model="room.nombre"
            label="Nombre"
            class="q-mb-md"
            :rules="[(val) => !!val || 'El nombre es obligatorio']"
          />

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
