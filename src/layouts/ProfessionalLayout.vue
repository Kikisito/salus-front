<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/AuthStore'
import { useUserStore } from 'src/stores/UserStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const userStore = useUserStore()
const { medicalProfile } = storeToRefs(userStore)

const loading = ref(true)
const drawer = ref(false)
const miniState = ref(true)

function toggleDrawer() {
  drawer.value = !drawer.value
}

const menuItems = [
  { label: 'Inicio', icon: 'home', path: '/professional/home' },
  { label: 'Mi agenda', icon: 'book', path: '/professional/agenda' },
  { label: 'Mensajería', icon: 'forum', path: '/professional/chats' },
  { label: 'Pacientes', icon: 'recent_actors', path: '/professional/patients', separator: true },
  { label: 'Volver a la aplicación', icon: 'arrow_back', path: '/home' },
  { label: 'Cerrar sesión', icon: 'logout', action: () => authStore.logout() },
]

onMounted(async () => {
  await userStore.getCurrentMedicalProfile()
  loading.value = false
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
        <q-toolbar-title>Área profesional</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      mini-to-overlay
      elevated
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(item, index) in menuItems" :key="item.label">
            <q-item
              clickable
              v-ripple
              :to="item.path || undefined"
              @click="item.action ? item.action() : null"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="item.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page v-if="loading" class="flex flex-center">
        <q-spinner color="primary" />
      </q-page>

      <q-page v-else-if="!medicalProfile || !medicalProfile.user" padding>
        <q-banner inline-actions class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          Ha ocurrido un error al cargar tus datos como profesional. Vuelve a intentarlo más tarde.
          <template v-slot:action>
            <q-btn flat label="Recargar" @click="userStore.getCurrentMedicalProfile()" />
          </template>
        </q-banner>
      </q-page>

      <router-view v-else />
    </q-page-container>
  </q-layout>
</template>
