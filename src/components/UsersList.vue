<script lang="ts" setup>
import EntityList from 'src/components/EntityList.vue'

import { type QTableColumn } from 'quasar'
import type { User } from 'src/interfaces/User'

defineProps({
  users: {
    type: Array as () => User[],
    required: true,
  },
  totalUsers: {
    type: Number,
    required: true,
  },
  onTableRequest: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showAddUserButton: {
    type: Boolean,
    default: false,
  },
  tableColumns: {
    type: Array as () => QTableColumn[],
    default: () => [
      { name: 'name', label: 'Nombre', field: 'nombre', align: 'left' },
      { name: 'surname', label: 'Apellidos', field: 'apellidos', align: 'left' },
      { name: 'idcard', label: 'DNI', field: 'nif', align: 'left' },
      { name: 'email', label: 'Correo', field: 'email', align: 'left' },
      { name: 'phone', label: 'Teléfono', field: 'telefono', align: 'left' },
      { name: 'actions', label: 'Acciones', field: '', align: 'left' },
    ],
  },
})

defineEmits(['user:new'])

const pagination = defineModel('pagination', {
  type: Object as () => {
    page: number
    rowsPerPage: number
    rowsNumber: number
  },
  required: true,
})
</script>

<template>
  <EntityList
    tableTitle="Listado de usuarios"
    :columns="tableColumns"
    :entities="users"
    :rowsNumber="totalUsers"
    :loading="loading"
    v-model:pagination="pagination"
    @table:request="onTableRequest($event)"
  >
    <template #top-right-additional>
      <q-btn
        v-if="showAddUserButton"
        icon="person_add"
        label="Crear usuario"
        color="primary"
        size="sm"
        class="q-ml-md"
        @click="$emit('user:new')"
      />
    </template>

    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <slot name="actions" :row="props.row" />
      </q-td>
    </template>
  </EntityList>
</template>
