<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DireccionDetails from 'src/components/DireccionDetails.vue'
import DireccionModal from 'src/components/DireccionModal.vue'
import { formattedDate } from 'src/helpers/formattedDate'
import { useAuthStore } from 'src/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const showDireccionModal = ref(false)
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-6">
        <div class="section-header row items-center">
          <div class="text-h6">Mi perfil</div>
          <q-space />
          <q-chip
            v-if="user"
            color="primary"
            text-color="white"
            label="Editar perfil"
            icon="edit"
          />
        </div>

        <template v-if="user">
          <q-card>
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
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>DNI</q-item-label>
                    <q-item-label>{{ user?.nif ?? 'No se ha especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Correo electrónico</q-item-label>
                    <q-item-label>{{ user?.email ?? 'No se ha especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Teléfono</q-item-label>
                    <q-item-label>{{ user?.telefono ?? 'No se ha especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Fecha de nacimiento</q-item-label>
                    <q-item-label>
                      {{
                        user?.fechaNacimiento
                          ? formattedDate(new Date(user?.fechaNacimiento))
                          : 'No se ha especificado'
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
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

          <q-card>
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
    </div>

    <DireccionModal
      v-if="user?.direccion"
      v-model:show="showDireccionModal"
      :direccion="user.direccion"
    />
  </q-page>
</template>

<style scoped>
.profile-page-header-margin-top {
  margin-top: 1rem;
}
</style>
