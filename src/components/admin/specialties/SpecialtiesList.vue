<script lang="ts" setup>
import EntityList from 'src/components/EntityList.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Dialog, Loading, Notify, type QTableColumn } from 'quasar'
import { useSpecialtyStore } from 'src/stores/admin/SpecialtyStore'
import SpecialtyDetails from 'src/components/admin/specialties/SpecialtyDetails.vue'
import type { Especialidad } from 'src/interfaces/Especialidad'
import SpecialtyForm from './SpecialtyForm.vue'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'

const specialtyStore = useSpecialtyStore()
const { specialties, count } = storeToRefs(specialtyStore)

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: (row) => row.nombre, align: 'left' },
  { name: 'description', label: 'Descripción', field: (row) => row.descripcion, align: 'left' },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]

const loading = ref(false)

async function fetchSpecialty(
  id: number,
  loadingMessage = 'Cargando especialidad...',
): Promise<Especialidad | null> {
  Loading.show({ message: loadingMessage })

  // Solicitamos los datos de la especialidad al servidor
  const specialtyResponse = await specialtyStore.getSpecialty(id)

  // Si la respuesta es exitosa, devolvemos los datos de la especialidad
  if (specialtyResponse.success) {
    return specialtyResponse.data
  } else {
    // Si hubo un error, mostramos un mensaje de error
    Notify.create({
      type: 'negative',
      message: 'Error al cargar la especialidad',
    })
    return null
  }
}

async function showSpecialty(id: number) {
  Loading.show({
    message: 'Cargando especialidad...',
  })

  const specialty = await fetchSpecialty(id)

  if (specialty) {
    Dialog.create({
      component: SpecialtyDetails,
      componentProps: { specialty },
    })
  }

  Loading.hide()
}

// Función genérica para editar o añadir una especialidad
function handleSpecialtyForm(
  specialtyProp: Especialidad | null,
  submitAction: (data: Especialidad) => Promise<ServiceAnswer<Especialidad>>,
  retryForm: (data?: Especialidad) => void,
) {
  Dialog.create({
    component: SpecialtyForm,
    componentProps: { specialtyProp },
  }).onOk((data: Especialidad) => {
    Loading.show({
      message: 'Procesando...',
    })

    submitAction(data)
      .then(() => {
        Notify.create({
          type: 'positive',
          message: 'Petición realizada con éxito',
        })
      })
      .catch((error: Error) => {
        Notify.create({
          type: 'negative',
          message: `Error al procesar la petición: ${error.message}`,
        })

        // Volvemos a abrir el formulario con los datos introducidos
        retryForm(data)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

function openSpecialtyAddForm(data?: Especialidad) {
  handleSpecialtyForm(
    data || null,
    (data) => specialtyStore.addSpecialty(data),
    openSpecialtyAddForm,
  )
}

async function editSpecialty(id: number) {
  Loading.show({
    message: 'Cargando especialidad...',
  })

  const specialty = await fetchSpecialty(id)

  if (specialty) {
    openSpecialtyEditForm(specialty as Especialidad)
  }

  Loading.hide()
}

function openSpecialtyEditForm(specialty?: Especialidad) {
  handleSpecialtyForm(
    specialty || null,
    (data) => specialtyStore.updateSpecialty(data),
    openSpecialtyEditForm,
  )
}

async function deleteSpecialty(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta especialidad?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({
      message: 'Eliminando especialidad...',
    })

    try {
      const response = await specialtyStore.deleteSpecialty(id)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Especialidad eliminada correctamente',
        })
      } else {
        console.error(
          'Error al eliminar la especialidad. El servidor ha devuelto el siguiente error:',
          response.error,
        )
        Notify.create({
          type: 'negative',
          message: 'Error al eliminar la especialidad',
        })
      }
    } catch (error) {
      console.error('Error al eliminar la especialidad', error)
      Notify.create({
        type: 'negative',
        message: `Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      })
    } finally {
      Loading.hide()
    }
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
    await specialtyStore.searchSpecialties(filter, page - 1, rowsPerPage)
  } else {
    await specialtyStore.getAllSpecialties(page - 1, rowsPerPage)
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
    tableTitle="Listado de especialidades médicas"
    :columns="tableColumns"
    :entities="specialties"
    :rowsNumber="count"
    :loading="loading"
    v-model:pagination="pagination"
    @table:request="onRequest($event)"
  >
    <template #top-right-additional>
      <q-btn
        icon="add"
        label="Añadir especialidad"
        color="primary"
        @click="openSpecialtyAddForm()"
        size="sm"
        class="q-ml-md"
      />
    </template>

    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <q-btn
          icon="visibility"
          color="green"
          size="sm"
          round
          @click="showSpecialty(props.row.id)"
        />

        <q-btn
          class="q-ml-sm"
          icon="edit"
          color="blue"
          size="sm"
          round
          @click="editSpecialty(props.row.id)"
        />

        <q-btn
          class="q-ml-sm"
          icon="delete"
          color="red"
          size="sm"
          round
          @click="deleteSpecialty(props.row.id)"
        />
      </q-td>
    </template>
  </EntityList>
</template>

<style scoped>
.actions-column {
  width: 150px;
}
</style>
