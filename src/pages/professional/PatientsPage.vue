<script lang="ts" setup>
import UsersList from 'src/components/UsersList.vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from 'src/stores/admin/UsersStore'
import { ref } from 'vue'
import { useUserStore } from 'src/stores/UserStore'

const usersStore = useUsersStore()
const { users, count } = storeToRefs(usersStore)

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: count.value,
})

const loading = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination
  const filter = props.filter

  loading.value = true
  // Si hay un filtro, aplicamos el método específico de búsqueda
  if (filter) {
    await usersStore.searchDoctorPatients(medicalProfile.value.id, filter, page - 1, rowsPerPage)
    // Si no, cargamos todos los usuarios de este doctor
  } else {
    await usersStore.getDoctorPatients(medicalProfile.value.id, page - 1, rowsPerPage)
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
          <div class="text-h6">Mis pacientes</div>
          <div class="text-subtitle">
            Listado con los pacientes que han tenido o tendrán una cita médica contigo
          </div>
        </div>

        <UsersList
          v-model:pagination="pagination"
          :users="users"
          :total-users="count"
          :onTableRequest="onRequest"
          :loading="loading"
        >
          <template #actions="props">
            <q-btn
              icon="visibility"
              color="green"
              size="sm"
              round
              @click="
                $router.push({ name: 'professional-patient-details', params: { id: props.row.id } })
              "
            />
          </template>
        </UsersList>
      </div>
    </div>
  </q-page>
</template>
