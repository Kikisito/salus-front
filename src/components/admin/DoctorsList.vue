<script lang="ts" setup>
import EntityList from '../EntityList.vue'

import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import type { QTableColumn } from 'quasar'
import { useDoctorStore } from 'src/stores/admin/DoctorStore'

const doctorStore = useDoctorStore()
const { doctors, count } = storeToRefs(doctorStore)

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: (row) => row.user.nombre, align: 'left' },
  { name: 'surname', label: 'Apellidos', field: (row) => row.user.apellidos, align: 'left' },
  { name: 'idcard', label: 'DNI', field: (row) => row.user.nif, align: 'left' },
  { name: 'email', label: 'Correo', field: (row) => row.user.email, align: 'left' },
  { name: 'phone', label: 'Teléfono', field: (row) => row.user.telefono, align: 'left' },
  {
    name: 'numcol',
    label: 'Número de Colegiado',
    field: (row) => row.license,
    align: 'left',
  },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]

const loading = ref(false)

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
    await doctorStore.search(filter, page - 1, rowsPerPage)
    // Si no, cargamos todos los usuarios
  } else {
    await doctorStore.getAll(page - 1, rowsPerPage)
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
    tableTitle="Listado de médicos"
    :columns="tableColumns"
    :entities="doctors"
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
          @click="$router.push({ name: 'admin-doctor', params: { id: props.row.id } })"
        />
      </q-td>
    </template>
  </EntityList>
</template>
