<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import type { QTableColumn } from 'quasar'
import { useUsersStore } from 'src/stores/admin/UsersStore'
import { onMounted, type PropType, ref } from 'vue'

defineProps({
  columns: {
    type: Array as PropType<QTableColumn[]>,
    required: true,
  },
})

const usersStore = useUsersStore()
const { users, count } = storeToRefs(usersStore)

const usersList = ref()
const loading = ref(false)
const filter = ref('')

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
// Carga inicial de datos de la tabla
onMounted(async () => {
  usersList.value.requestServerInteraction()
})
</script>

<template>
  <q-table
    ref="usersList"
    title="Listado de usuarios"
    :columns="columns"
    :rows="users"
    :filter="filter"
    :pagination-label="(start, end, total) => `${start} - ${end} de ${total}`"
    rows-per-page-label="Filas por página"
    :rows-per-page-options="[5, 10, 25, 100]"
    no-data-label="No hay datos disponibles"
    no-results-label="No se encontraron resultados"
    v-model:pagination="pagination"
    :loading="loading"
    @request="onRequest"
    flat
    bordered
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell-actions="props">
      <slot name="actions" v-bind="props" />
    </template>
  </q-table>
</template>

<style scoped>
.q-table__container {
  background-color: #f7faff;
}

.actions-column > .q-btn:not(:last-child) {
  margin-right: 0.25rem;
}
</style>
