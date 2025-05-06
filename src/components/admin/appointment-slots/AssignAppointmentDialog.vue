<script lang="ts" setup>
import { useDialogPluginComponent, Notify } from 'quasar'
import type { User } from 'src/interfaces/User'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { PropType } from 'vue'
import { ref } from 'vue'
import type { AppointmentRequest } from 'src/interfaces/AppointmentRequest'
import { formattedAppointmentType } from 'src/helpers/formattedAppointmentType'

const props = defineProps({
  getAllUsers: {
    type: Function as PropType<(page?: number, limit?: number) => Promise<ServiceAnswer<User[]>>>,
    required: true,
  },
  searchUsers: {
    type: Function as PropType<
      (search: string, page?: number, limit?: number) => Promise<ServiceAnswer<User[]>>
    >,
    required: true,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const appointmentData = ref<Partial<AppointmentRequest>>()

const users = ref<User[]>([])
const selectedUser = ref<User>(null as unknown as User)

// Tipos de cita disponibles
const appointmentTypes = [
  { value: 'IN_PERSON', label: formattedAppointmentType('IN_PERSON') },
  { value: 'PHONE', label: formattedAppointmentType('PHONE') },
]
const appointmentType = ref('')

const appointmentReason = ref('')

const isLoading = ref(false)

const filterUsers = async (val: string, update: (callback: () => void) => void) => {
  update(async () => {
    isLoading.value = true
    try {
      let response

      // Si el valor de búsqueda está vacío, obtenemos todos los usuarios si no, hacemos una búsqueda
      if (val === '') {
        response = await props.getAllUsers(0, 10)
      } else {
        response = await props.searchUsers(val, 0, 10)
      }

      if (response.success) {
        users.value = response.data
      } else {
        console.error('Error al filtrar usuarios:', response.error)
        Notify.create({
          type: 'negative',
          message: 'Error al cargar los usuarios',
        })
      }
    } catch (error) {
      console.error('Error en la búsqueda de usuarios:', error)
      Notify.create({
        type: 'negative',
        message: 'Error en la búsqueda de usuarios',
      })
    } finally {
      isLoading.value = false
    }
  })
}

const submitForm = () => {
  appointmentData.value = {
    patient: selectedUser.value.id,
    type: appointmentType.value,
    reason: appointmentReason.value,
  }

  onDialogOK(appointmentData.value)
}
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="person_search" />
        </q-avatar>

        <q-toolbar-title>Asignar cita</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="submitForm()">
          <div class="text-subtitle1 q-mb-md">Selecciona un usuario para la cita</div>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="selectedUser"
                :options="users"
                label="Buscar usuario"
                use-input
                hide-selected
                fill-input
                input-debounce="300"
                @filter="filterUsers"
                :loading="isLoading"
                :rules="[(val) => !!val || 'Debes seleccionar un usuario']"
                option-label="nombre"
                filled
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No se encontraron usuarios </q-item-section>
                  </q-item>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon name="person" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.nombre }} {{ scope.opt.apellidos }}</q-item-label>
                      <q-item-label caption>
                        {{ scope.opt.nif }} | {{ scope.opt.email }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:selected>
                  <template v-if="selectedUser">
                    <div class="row items-center">
                      <q-icon name="person" class="q-mr-sm" />
                      {{ selectedUser.nombre }} {{ selectedUser.apellidos }} ({{
                        selectedUser.nif
                      }})
                    </div>
                  </template>
                </template>
              </q-select>
            </div>
          </div>

          <!-- Tipo de cita -->
          <div class="col-12 q-mt-md">
            <q-select
              v-model="appointmentType"
              :options="appointmentTypes"
              label="Tipo de cita"
              :rules="[(val) => !!val || 'Debes seleccionar un tipo de cita']"
              emit-value
              map-options
              filled
            />
          </div>

          <!-- Razón de la cita -->
          <div class="col-12 q-mt-md">
            <q-input
              v-model="appointmentReason"
              label="Razón de la cita"
              type="textarea"
              autogrow
              filled
            />
          </div>

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12">
              <q-btn
                class="full-width"
                color="primary"
                label="Seleccionar usuario"
                type="submit"
                :disable="!selectedUser || !appointmentType"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
