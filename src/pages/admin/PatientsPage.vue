<script lang="ts" setup>
import type { QTableColumn } from 'quasar'
import UsersList from 'src/components/admin/UsersList.vue'

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'surname', label: 'Apellidos', field: 'apellidos', align: 'left' },
  { name: 'idcard', label: 'DNI', field: 'nif', align: 'left' },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' },
  { name: 'phone', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header">
          <div class="text-h6">Usuarios registrados</div>
          <div class="text-subtitle">Comprueba los usuarios registrados en la aplicación</div>
        </div>
        <UsersList :columns="tableColumns">
          <template #actions="props">
            <q-td :props="props" class="actions-column">
              <q-btn icon="visibility" color="green" size="sm" round />
            </q-td>
          </template>
        </UsersList>
      </div>
    </div>
  </q-page>
</template>
