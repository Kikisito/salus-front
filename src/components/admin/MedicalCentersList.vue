<script lang="ts" setup>
import EntityList from '../EntityList.vue'

import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { Dialog, Notify, type QTableColumn } from 'quasar'
import { useMedicalCenterStore } from 'src/stores/admin/MedicalCenterStore'
import MedicalCenterDetails from './MedicalCenterDetails.vue'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'

const medicalCenterStore = useMedicalCenterStore()
const { medicalCenters, count } = storeToRefs(medicalCenterStore)

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: (row) => row.nombre, align: 'left' },
  { name: 'phone', label: 'Teléfono', field: (row) => row.telefono, align: 'left' },
  { name: 'email', label: 'Email', field: (row) => row.email, align: 'left' },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]

const loading = ref(false)

async function showMedicalCenter(id: number) {
  // Solicitamos los datos del centro médico al servidor
  const medicalCenterResponse = await medicalCenterStore.getMedicalCenter(id)

  // Si la respuesta es exitosa, mostramos el diálogo con los datos del centro médico
  let medicalCenter: MedicalCenter | null = null
  if (medicalCenterResponse.success) {
    medicalCenter = medicalCenterResponse.data
  } else {
    // Si hubo un error, mostramos un mensaje de error
    Notify.create({
      type: 'negative',
      message: 'Error al cargar el centro médico',
    })
    return
  }

  console.log('medicalCenter', medicalCenterResponse)

  Dialog.create({
    component: MedicalCenterDetails,
    componentProps: {
      medicalCenter: medicalCenter,
    },
  }).onDismiss(() => {
    // Aquí puedes manejar la respuesta del diálogo si es necesario
    console.log('OK')
  })
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: count.value,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination
  const filter = props.filter

  loading.value = true
  // Si hay un filtro, aplicamos el método específico de búsqueda
  if (filter) {
    //await doctorStore.search(filter, page - 1, rowsPerPage)
    // Si no, cargamos todos los usuarios
  } else {
    await medicalCenterStore.getAllMedicalCenters(page - 1, rowsPerPage)
  }

  // Actualizamos los datos de la paginación
  pagination.value.rowsNumber = count.value
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  loading.value = false
}
</script>

<template>
  <EntityList
    tableTitle="Listado de centros médicos"
    :columns="tableColumns"
    :entities="medicalCenters"
    :rowsNumber="count"
    :loading="loading"
    v-model:pagination="pagination"
    @table:request="onRequest($event)"
  >
    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <q-btn
          icon="visibility"
          color="green"
          size="sm"
          round
          @click="showMedicalCenter(props.row.id)"
        />
      </q-td>
    </template>
  </EntityList>
</template>
