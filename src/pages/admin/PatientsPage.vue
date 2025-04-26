<script lang="ts" setup>
import UsersList from 'src/components/UsersList.vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from 'src/stores/admin/UsersStore'
import RegisterUserDialog from 'src/components/admin/users/RegisterUserDialog.vue'
import { Dialog, Loading, Notify } from 'quasar'
import { ref } from 'vue'

const usersStore = useUsersStore()
const { users, count } = storeToRefs(usersStore)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: count.value,
})

const loading = ref(false)

async function openCreateUserDialog() {
  Dialog.create({
    component: RegisterUserDialog,
    componentProps: {
      randomPassword: true,
      persistent: true,
    },
  }).onOk(async (user) => {
    Loading.show({
      message: 'Creando usuario...',
    })

    const response = await usersStore.createUser(user)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Usuario creado correctamente',
      })
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al crear el usuario',
      })
    }

    Loading.hide()
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination
  const filter = props.filter

  loading.value = true
  // Si hay un filtro, aplicamos el método específico de búsqueda
  if (filter) {
    await usersStore.searchFromAllUsers(filter, page - 1, rowsPerPage)
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
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Usuarios registrados</div>
          <div class="text-subtitle">Comprueba los usuarios registrados en la aplicación</div>
        </div>

        <UsersList
          v-model:pagination="pagination"
          :users="users"
          :total-users="count"
          :onTableRequest="onRequest"
          :loading="loading"
          @user:new="openCreateUserDialog()"
          show-add-user-button
        >
          <template #actions="props">
            <q-btn
              icon="visibility"
              color="green"
              size="sm"
              round
              @click="$router.push({ name: 'admin-patient', params: { id: props.row.id } })"
            />
          </template>
        </UsersList>
      </div>
    </div>
  </q-page>
</template>
