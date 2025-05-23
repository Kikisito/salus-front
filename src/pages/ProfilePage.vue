<script setup lang="ts">
import { Notify } from 'quasar'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import DireccionDetails from 'src/components/DireccionDetails.vue'
import DireccionModal from 'src/components/DireccionModal.vue'
import ProfileChangeUserDataModal from 'src/components/ProfileChangeUserDataModal.vue'
import UserDetails from 'src/components/UserDetails.vue'
import { useUserStore } from 'src/stores/UserStore'

import type { Direccion } from 'src/interfaces/Direccion'
import type { User } from 'src/interfaces/User'
import { useAuthStore } from 'src/stores/AuthStore'

const loading = ref(true)

const authStore = useAuthStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const showUserDataModal = ref(false)
const showDireccionModal = ref(false)

onMounted(async () => {
  // Actualizamos los datos del usuario cada vez que se carga la página
  // Así, si se cambian los datos desde otro sitio, se reflejarán
  await userStore.getCurrentUser()
  loading.value = false
})

const updateProfile = async (user: User) => {
  const response = await userStore.updateProfile(user)

  if (response.success) {
    Notify.create({
      message: 'Perfil actualizado correctamente',
      color: 'positive',
      icon: 'check',
    })
    showUserDataModal.value = false
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}

const setDireccion = async (direccion: Direccion) => {
  const response = await userStore.setAddress(direccion)
  if (response.success) {
    Notify.create({
      message: 'Dirección actualizada correctamente',
      color: 'positive',
      icon: 'check',
    })
    showDireccionModal.value = false
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}

async function requestEmailVerification() {
  const response = await authStore.requestEmailVerification()
  if (response.success) {
    Notify.create({
      message: 'Correo de verificación enviado correctamente',
      color: 'positive',
      icon: 'check',
    })
  } else {
    Notify.create({
      message: response.error,
      color: 'negative',
      icon: 'error',
    })
  }
}
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-6">
        <!-- Si el usuario no está verificado, mostramos un banner -->
        <q-banner
          v-if="user?.accountStatusType === 'NOT_VERIFIED'"
          class="bg-red text-white"
          rounded
          style="margin-bottom: 1rem"
        >
          <template v-slot:avatar>
            <q-icon name="warning" size="2rem" />
          </template>
          Tu correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada y haz
          clic en el enlace de verificación que te hemos enviado.
          <template v-slot:action>
            <q-btn
              class="q-ml-sm"
              label="Reenviar correo de verificación"
              @click="requestEmailVerification()"
              flat
            />
          </template>
        </q-banner>

        <div class="section-header row items-center">
          <div class="text-h6">Mi perfil</div>
          <q-space />
          <q-chip
            v-if="user"
            color="primary"
            text-color="white"
            label="Editar perfil"
            icon="edit"
            clickable
            @click="showUserDataModal = true"
          />
        </div>

        <template v-if="user">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white" style="background-color: #26a69a">
                  {{ user?.nombre?.charAt(0) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ user?.nombre }} {{ user?.apellidos }}</q-item-label>
                <q-item-label caption>{{ user?.email }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-card-section>
              <UserDetails :user="user" />
            </q-card-section>
          </q-card>

          <div class="section-header profile-page-header-margin-top row items-center">
            <div class="text-h6">Mi dirección</div>
            <q-space />
            <q-chip
              color="primary"
              text-color="white"
              :label="user?.direccion ? 'Editar dirección' : 'Añadir dirección'"
              icon="edit"
              clickable
              @click="showDireccionModal = true"
            />
          </div>

          <q-card flat bordered>
            <q-card-section>
              <DireccionDetails :direccion="user.direccion" />
            </q-card-section>
          </q-card>
        </template>

        <q-card v-else>
          <q-card-section>
            <span>
              No se ha podido cargar la información de tu perfil. Por favor, vuelve a iniciar sesión
              e inténtalo de nuevo.
            </span>
          </q-card-section>
        </q-card>
      </div>

      <ProfileChangeUserDataModal
        v-model:show="showUserDataModal"
        :user="user"
        @form:submit="updateProfile($event)"
      />

      <DireccionModal
        v-model:show="showDireccionModal"
        :direccion="user?.direccion"
        @form:submit="setDireccion($event)"
      />
    </div>

    <div v-else class="q-pa-md">
      <div class="text-center q-pa-xl">
        <q-spinner size="3em" color="primary" />
        <div class="text-subtitle1 q-mt-md">Cargando...</div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.profile-page-header-margin-top {
  margin-top: 1rem;
}
</style>
