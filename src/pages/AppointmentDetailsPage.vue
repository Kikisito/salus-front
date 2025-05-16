<script lang="ts" setup>
import { Dialog, Notify, Platform } from 'quasar'
import { formattedAppointmentType } from 'src/helpers/formattedAppointmentType'
import type { Appointment } from 'src/interfaces/Appointment'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Network } from '@capacitor/network'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const appointmentId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const deviceHasNetwork = ref(false)

const appointmentStore = useAppointmentStore()

const appointment = ref<Appointment>()

// Fab
const fab = ref(false)
const loading = ref(true)

const mapsLocation = computed(() => {
  const { slot } = appointment.value!
  return `${slot.room.medicalCenter.addressLine1}, ${slot.room.medicalCenter.addressLine2}, ${slot.room.medicalCenter.locality}, ${slot.room.medicalCenter.municipality}, ${slot.room.medicalCenter.province}, ${slot.room.medicalCenter.zipCode}, ${slot.room.medicalCenter.country}`
})

async function openLocation() {
  if (!appointment.value) return

  const address = mapsLocation.value
  let url = `https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`

  if (Platform.is.ios) {
    url = `maps://?q=${encodeURIComponent(address)}`
  } else if (Platform.is.android) {
    url = `geo:0,0?q=${encodeURIComponent(address)}`
  }

  // Abrimos la URL. Si es un dispositivo móvil, abrirá la aplicación de mapas correspondiente
  // Si es un navegador de escritorio, abrirá Google Maps en el navegador
  window.open(url, '_blank')
}

async function deleteAppointment() {
  if (!appointment.value) return

  Dialog.create({
    title: 'Eliminar cita',
    message:
      '¿Estás seguro de que deseas eliminar esta cita? Solo podrás eliminarla si faltan más de 24 horas para la cita.',
    ok: {
      label: 'Eliminar',
      color: 'red',
    },
    cancel: {
      label: 'Cancelar',
    },
  }).onOk(async () => {
    const response = await appointmentStore.deleteAppointment(appointment.value!)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Cita eliminada correctamente',
      })
      router.push({ name: 'appointments' })
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  })
}

onMounted(async () => {
  const networkStatus = await Network.getStatus()
  deviceHasNetwork.value = networkStatus.connected

  if (networkStatus.connected) {
    try {
      const response = await appointmentStore.getAppointment(Number.parseInt(appointmentId!))

      if (response.success) {
        appointment.value = response.data
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al cargar la cita',
        })
      }
    } finally {
      loading.value = false
    }
  } else {
    // Cargamos los datos de la cita desde el store (los almacenamos en el store cuando tenía internet)
    const { appointments } = storeToRefs(appointmentStore)
    appointment.value = appointments.value.find(
      (appointment) => appointment.id === Number.parseInt(appointmentId!),
    )

    if (!appointment.value) {
      Notify.create({
        type: 'negative',
        message: 'No se ha podido cargar la cita. Por favor, inténtalo con conexión a internet.',
      })
      router.push({ name: 'appointments' })
    }

    loading.value = false

    Notify.create({
      message: 'No tienes conexión a internet. Los datos de la cita pueden no estar actualizados.',
      type: 'negative',
    })
  }
})
</script>

<template>
  <q-page padding>
    <template v-if="appointment">
      <div class="row justify-evenly">
        <div class="col-12 col-md-9">
          <div class="section-header row items-center">
            <q-btn flat round icon="arrow_back" @click="$router.back()" />
            <div>
              <div class="text-h6">Cita de {{ appointment.slot.specialty.name }}</div>
              <div class="text-subtitle2">Detalles de la cita</div>
            </div>
          </div>

          <div class="row justify-evenly">
            <div class="col-12 col-md-6">
              <div class="section-header">
                <div class="text-h6">Tu cita de {{ appointment.slot.specialty.name }}</div>
              </div>

              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>Especialidad</q-item-label>
                    <q-item-label caption>{{ appointment.slot.specialty.name }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>Fecha</q-item-label>
                    <q-item-label caption>
                      {{
                        new Date(appointment.slot.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>Hora</q-item-label>
                    <q-item-label caption>
                      Tu cita tendrá lugar a las {{ appointment.slot.startTime.slice(0, 5) }} ({{
                        new Date(`1970-01-01T${appointment.slot.startTime}`).toLocaleTimeString(
                          'es-ES',
                          { hour: '2-digit', minute: '2-digit', hour12: true },
                        )
                      }})
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>Ubicación</q-item-label>
                    <q-item-label caption>
                      <span class="block text-bold">
                        {{ appointment.slot.room.medicalCenter.name }}
                      </span>

                      <span class="block">
                        {{ appointment.slot.room.medicalCenter.addressLine1 }},
                        {{ appointment.slot.room.medicalCenter.addressLine2 }}
                      </span>

                      <span class="block">
                        {{ appointment.slot.room.medicalCenter.locality }},
                        {{ appointment.slot.room.medicalCenter.municipality }}
                      </span>

                      <span class="block">
                        {{ appointment.slot.room.medicalCenter.province }},
                        {{ appointment.slot.room.medicalCenter.zipCode }}
                        ({{ appointment.slot.room.medicalCenter.country }})
                      </span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-btn outline size="sm" @click="openLocation()">
                      <q-icon class="cursor-pointer" name="open_in_new" />
                    </q-btn>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>Doctor</q-item-label>
                    <q-item-label caption>
                      {{ appointment.slot.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
                      {{ appointment.slot.doctor.user.nombre }}
                      {{ appointment.slot.doctor.user.apellidos }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>Tipo</q-item-label>
                    <q-item-label caption>
                      {{ formattedAppointmentType(appointment.type) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="desktop-only">
                <div class="section-header">
                  <div class="text-h6">
                    Información sobre
                    {{ appointment.slot.doctor.user.sexo === 'Mujer' ? 'la doctora' : 'el doctor' }}
                  </div>
                </div>

                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Nombre</q-item-label>
                      <q-item-label caption>
                        {{ appointment.slot.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
                        {{ appointment.slot.doctor.user.nombre }}
                        {{ appointment.slot.doctor.user.apellidos }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>Especialidad</q-item-label>
                      <q-item-label caption>
                        {{ appointment.slot.specialty.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>Correo electrónico</q-item-label>
                      <q-item-label caption>
                        {{ appointment.slot.doctor.workEmail || 'No disponible' }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>Teléfono</q-item-label>
                      <q-item-label caption>
                        {{ appointment.slot.doctor.workPhone || 'No disponible' }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="section-header">
                <div class="text-h6">Ubicación de la cita</div>
              </div>

              <q-list>
                <q-item>
                  <q-item-section>
                    <iframe
                      v-if="deviceHasNetwork"
                      :src="`https://www.google.com/maps?q=${mapsLocation}&output=embed`"
                      style="border: 0; width: 100%; aspect-ratio: 1 / 1"
                      allowfullscreen
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    />

                    <q-card-section v-else class="text-center">
                      <q-icon name="signal_wifi_off" size="4em" color="grey-5" />
                      <div class="text-h6">Sin conexión a internet</div>
                      <div class="text-subtitle2">
                        No se puede mostrar el mapa sin conexión a internet.
                      </div>
                    </q-card-section>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          v-model="fab"
          label="Acciones"
          label-position="left"
          color="primary"
          icon="keyboard_arrow_up"
          vertical-actions-align="right"
          direction="up"
        >
          <q-fab-action color="red" icon="delete" label="Eliminar" @click="deleteAppointment()" />
        </q-fab>
      </q-page-sticky>
    </template>

    <template v-else-if="loading">
      <div class="text-center q-pa-xl">
        <q-spinner size="3em" color="primary" />
        <div class="text-subtitle1 q-mt-md">Cargando datos de la cita...</div>
      </div>
    </template>

    <template v-else>
      <q-banner inline-actions class="text-white bg-red">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Ha ocurrido un error al cargar la cita. Por favor, inténtalo de nuevo más tarde.
        <template v-slot:action>
          <q-btn
            flat
            label="Volver a mis citas"
            color="white"
            @click="$router.push({ name: 'appointments' })"
          />
        </template>
      </q-banner>
    </template>
  </q-page>
</template>

<style scoped>
.q-list {
  margin: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: #f7fbff;
  border: 1px solid #e4e7eb;
}

.q-list--dark {
  background-color: #1a202c;
  border: 1px solid #2d3748;
}
</style>
