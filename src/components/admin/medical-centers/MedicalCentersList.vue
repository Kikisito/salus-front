<script lang="ts" setup>
import EntityList from 'src/components/EntityList.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Dialog, Loading, Notify, type QTableColumn } from 'quasar'
import { useMedicalCenterStore } from 'src/stores/admin/MedicalCenterStore'
import MedicalCenterDetails from 'src/components/admin/medical-centers/MedicalCenterDetails.vue'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import MedicalCenterForm from './MedicalCenterForm.vue'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'

const medicalCenterStore = useMedicalCenterStore()
const { medicalCenters, count } = storeToRefs(medicalCenterStore)

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: (row) => row.name, align: 'left' },
  { name: 'phone', label: 'Teléfono', field: (row) => row.phone, align: 'left' },
  { name: 'email', label: 'Email', field: (row) => row.email, align: 'left' },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]

const loading = ref(false)

async function fetchMedicalCenter(
  id: number,
  loadingMessage = 'Cargando centro médico...',
): Promise<MedicalCenter | null> {
  Loading.show({ message: loadingMessage })

  // Solicitamos los datos del centro médico al servidor
  const medicalCenterResponse = await medicalCenterStore.getMedicalCenter(id)

  // Si la respuesta es exitosa, devolvemos los datos del centro médico
  if (medicalCenterResponse.success) {
    return medicalCenterResponse.data
  } else {
    // Si hubo un error, mostramos un mensaje de error
    Notify.create({
      type: 'negative',
      message: 'Error al cargar el centro médico',
    })
    return null
  }
}

async function showMedicalCenter(id: number) {
  Loading.show({
    message: 'Cargando centro médico...',
  })

  const medicalCenter = await fetchMedicalCenter(id)

  if (medicalCenter) {
    Dialog.create({
      component: MedicalCenterDetails,
      componentProps: { medicalCenter },
    })
  }

  Loading.hide()
}

// Función genérica para editar o añadir un centro médico
function handleMedicalCenterForm(
  medicalCenterProp: MedicalCenter | null,
  submitAction: (data: MedicalCenter) => Promise<ServiceAnswer<MedicalCenter>>,
  retryForm: (data?: MedicalCenter) => void,
) {
  Dialog.create({
    component: MedicalCenterForm,
    componentProps: { medicalCenterProp },
  }).onOk((data: MedicalCenter) => {
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

function openMedicalCenterAddForm(data?: MedicalCenter) {
  handleMedicalCenterForm(
    data || null,
    (data) => medicalCenterStore.addMedicalCenter(data),
    openMedicalCenterAddForm,
  )
}

async function editMedicalCenter(id: number) {
  Loading.show({
    message: 'Cargando centro médico...',
  })

  const medicalCenter = await fetchMedicalCenter(id)

  if (medicalCenter) {
    openMedicalCenterEditForm(medicalCenter as MedicalCenter)
  }

  Loading.hide()
}

function openMedicalCenterEditForm(medicalCenter?: MedicalCenter) {
  handleMedicalCenterForm(
    medicalCenter || null,
    (data) => medicalCenterStore.updateMedicalCenter(data),
    openMedicalCenterEditForm,
  )
}

async function deleteMedicalCenter(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar este centro médico?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({
      message: 'Eliminando centro médico...',
    })

    try {
      const response = await medicalCenterStore.deleteMedicalCenter(id)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Centro médico eliminado correctamente',
        })
      } else {
        console.error(
          'Error al eliminar el centro médico. El servidor ha devuelto el siguiente error:',
          response.error,
        )
        Notify.create({
          type: 'negative',
          message: 'Error al eliminar el centro médico',
        })
      }
    } catch (error) {
      console.error('Error al eliminar el centro médico', error)
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
    <template #top-right>
      <q-btn
        icon="domain_add"
        label="Añadir centro médico"
        color="primary"
        @click="openMedicalCenterAddForm()"
        size="sm"
      />
    </template>

    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <q-btn
          icon="visibility"
          color="green"
          size="sm"
          round
          @click="showMedicalCenter(props.row.id)"
        />

        <q-btn
          class="q-ml-sm"
          icon="edit"
          color="blue"
          size="sm"
          round
          @click="editMedicalCenter(props.row.id)"
        />

        <q-btn
          class="q-ml-sm"
          icon="delete"
          color="red"
          size="sm"
          round
          @click="deleteMedicalCenter(props.row.id)"
        />
      </q-td>
    </template>
  </EntityList>
</template>
