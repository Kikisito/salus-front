<script lang="ts" setup>
import EntityList from '../EntityList.vue'

import { storeToRefs } from 'pinia'
import { useUsersStore } from 'src/stores/admin/UsersStore'
import { ref } from 'vue'

import type { QTableColumn } from 'quasar'

const usersStore = useUsersStore()
const { users, count } = storeToRefs(usersStore)

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'surname', label: 'Apellidos', field: 'apellidos', align: 'left' },
  { name: 'idcard', label: 'DNI', field: 'nif', align: 'left' },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' },
  { name: 'phone', label: 'Teléfono', field: 'telefono', align: 'left' },
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
    await usersStore.searchUsers(filter, page - 1, rowsPerPage)
    // Si no, cargamos todos los usuarios
  } else {
    await usersStore.getAllUsers(page - 1, rowsPerPage)
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
    tableTitle="Listado de usuarios"
    :columns="tableColumns"
    :entities="users"
    :rowsNumber="count"
    :loading="loading"
    v-model:pagination="pagination"
    @table:request="onRequest($event)"
  >
    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <q-btn icon="visibility" color="green" size="sm" round />
      </q-td>
    </template>
  </EntityList>
</template>
