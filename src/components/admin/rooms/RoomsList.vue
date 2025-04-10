<script lang="ts" setup>
import EntityList from 'src/components/EntityList.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Dialog, Loading, Notify, type QTableColumn } from 'quasar'
import { useMedicalCenterStore } from 'src/stores/admin/MedicalCenterStore'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import { useRoomStore } from 'src/stores/admin/RoomStore'
import type { Room } from 'src/interfaces/Room'
import RoomForm from './RoomForm.vue'
import RoomDetails from './RoomDetails.vue'

const roomStore = useRoomStore()
const { rooms, count } = storeToRefs(roomStore)

const medicalCenterStore = useMedicalCenterStore()

const tableColumns: QTableColumn[] = [
  { name: 'name', label: 'Nombre', field: (row) => row.nombre, align: 'left' },
  {
    name: 'medicalCenter',
    label: 'Centro Médico',
    field: (row) => row.centroMedico.nombre,
    align: 'left',
  },
  { name: 'actions', label: 'Acciones', field: '', align: 'left' },
]

const loading = ref(false)

async function fetchRoom(id: number, loadingMessage = 'Cargando datos...'): Promise<Room | null> {
  Loading.show({ message: loadingMessage })

  // Solicitamos los datos del centro médico al servidor
  const roomResponse = await roomStore.getRoom(id)

  // Si la respuesta es exitosa, devolvemos los datos del centro médico
  if (roomResponse.success) {
    return roomResponse.data
  } else {
    // Si hubo un error, mostramos un mensaje de error
    Notify.create({
      type: 'negative',
      message: 'Error al cargar el centro médico',
    })
    return null
  }
}

async function showRoom(id: number) {
  Loading.show({
    message: 'Cargando datos...',
  })

  const room = await fetchRoom(id)

  if (room) {
    Dialog.create({
      component: RoomDetails,
      componentProps: { room },
    })
  }

  Loading.hide()
}

// Función genérica para editar o añadir una consulta
function handleRoomForm(
  room: Room | null,
  submitAction: (data: Room) => Promise<ServiceAnswer<Room>>,
  retryForm: (data?: Room) => void,
) {
  Dialog.create({
    component: RoomForm,
    componentProps: {
      room,
      getAllMedicalCenters: medicalCenterStore.getAllMedicalCenters,
      searchMedicalCenters: medicalCenterStore.searchMedicalCenters,
    },
  }).onOk((data: Room) => {
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

function openRoomAddForm(data?: Room) {
  handleRoomForm(data || null, (data) => roomStore.addRoom(data), openRoomAddForm)
}

async function editRoom(id: number) {
  Loading.show({
    message: 'Cargando centro médico...',
  })

  const room = await fetchRoom(id)

  if (room) {
    openRoomEditForm(room as Room)
  }

  Loading.hide()
}

function openRoomEditForm(room?: Room) {
  handleRoomForm(room || null, (data) => roomStore.updateRoom(data), openRoomEditForm)
}

async function deleteRoom(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta consulta?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({
      message: 'Eliminando consulta...',
    })

    try {
      const response = await roomStore.deleteRoom(id)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Consulta eliminada correctamente',
        })
      } else {
        console.error(
          'Error al eliminar la consulta. El servidor ha devuelto el siguiente error:',
          response.error,
        )
        Notify.create({
          type: 'negative',
          message: 'Error al eliminar la consulta',
        })
      }
    } catch (error) {
      console.error('Error al eliminar la consulta', error)
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
    await roomStore.searchRooms(filter, page - 1, rowsPerPage)
    // Si no, cargamos todos los usuarios
  } else {
    await roomStore.getAllRooms(page - 1, rowsPerPage)
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
    tableTitle="Listado de consultas"
    :columns="tableColumns"
    :entities="rooms"
    :rowsNumber="count"
    :loading="loading"
    v-model:pagination="pagination"
    @table:request="onRequest($event)"
  >
    <template #top-right-additional>
      <q-btn
        icon="meeting_room"
        label="Añadir consulta"
        color="primary"
        @click="openRoomAddForm()"
        size="sm"
        class="q-ml-md"
      />
    </template>

    <template #actions="props">
      <q-td :props="props" class="actions-column">
        <q-btn icon="visibility" color="green" size="sm" round @click="showRoom(props.row.id)" />

        <q-btn
          class="q-ml-sm"
          icon="edit"
          color="blue"
          size="sm"
          round
          @click="editRoom(props.row.id)"
        />

        <q-btn
          class="q-ml-sm"
          icon="delete"
          color="red"
          size="sm"
          round
          @click="deleteRoom(props.row.id)"
        />
      </q-td>
    </template>
  </EntityList>
</template>
