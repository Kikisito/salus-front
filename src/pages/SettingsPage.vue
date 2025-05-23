<script setup lang="ts">
import { Loading, Notify } from 'quasar'

import ChangePassword from 'src/components/ChangePassword.vue'
import { useUserStore } from 'src/stores/UserStore'

import type { PasswordChangeRequest } from 'src/interfaces/PasswordChangeRequest'
import formatLocaleTimeAgo from 'src/helpers/formatLocaleTimeAgo'
import { onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/AuthStore'

const loading = ref(true)

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(async () => {
  // Actualizamos los datos del usuario cada vez que se carga la página
  // Así, si se cambian los datos desde otro sitio, se reflejarán
  await userStore.getCurrentUser()
  loading.value = false
})

const changePassword = async (values: PasswordChangeRequest) => {
  Loading.show({
    message: 'Cambiando tu contraseña...',
  })

  const changePasswordResult = await userStore.changePassword(values)
  if (changePasswordResult.success) {
    Notify.create({
      icon: 'check',
      message: 'Tu contraseña ha sido cambiada correctamente',
      color: 'positive',
    })
  } else {
    Notify.create({
      icon: 'report_problem',
      message: changePasswordResult.error,
      color: 'negative',
    })
  }

  Loading.hide()
}

const closeAllSessions = async () => {
  Loading.show({
    message: 'Cerrando todas las sesiones...',
  })

  const closeSessionsResult = await userStore.closeAllSessions()
  if (closeSessionsResult.success) {
    Notify.create({
      icon: 'check',
      message: 'Todas las sesiones han sido cerradas correctamente',
      color: 'positive',
    })

    await authStore.logout()
  } else {
    Notify.create({
      icon: 'report_problem',
      message: closeSessionsResult.error,
      color: 'negative',
    })
  }

  Loading.hide()
}
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header row items-center">
          <div class="text-h6">Ajustes</div>
        </div>

        <q-list v-if="userStore.user" separator bordered class="rounded-borders">
          <q-expansion-item icon="password">
            <template #header>
              <q-item-section avatar>
                <q-icon name="password" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Contraseña</q-item-label>
                <q-item-label caption>
                  <span v-if="userStore.user?.lastPasswordChange">
                    El último cambio de contraseña fue
                    {{ formatLocaleTimeAgo(userStore.user?.lastPasswordChange) }}
                  </span>
                  <span v-else> Nunca has cambiado tu contraseña </span>
                </q-item-label>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <q-banner inline-actions class="text-white bg-red q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="white" />
                  </template>
                  <span>
                    Por seguridad, al cambiar tu contraseña se cerrarán todas tus sesiones activas.
                    Deberás volver a iniciar sesión en todos tus dispositivos con la nueva
                    contraseña. El dispositivo actual no se verá afectado.
                  </span>
                </q-banner>

                <ChangePassword @form:validated="changePassword($event)" />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            icon="signal_wifi_off"
            label="Tus sesiones"
            caption="Comprueba todas las sesiones activas de tu cuenta"
          >
            <q-card>
              <q-card-section>
                <span>
                  Cierra todas las sesiones activas de tu cuenta. Esto cerrará la sesión en todos
                  los dispositivos en los que hayas iniciado sesión,
                  <b>incluyendo el dispositivo actual</b>.
                </span>

                <div class="full-width text-center">
                  <q-btn
                    label="Cerrar todas las sesiones"
                    color="red"
                    icon="logout"
                    class="q-mt-md"
                    @click="closeAllSessions()"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-card v-else>
          <q-card-section>
            <span>
              No se ha podido cargar la información de tu perfil. Por favor, vuelve a iniciar sesión
              e inténtalo de nuevo.
            </span>
          </q-card-section>
        </q-card>
      </div>
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
.q-list {
  background-color: #f1f4f8;
}
</style>
