<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
        <q-toolbar-title>Project Salus</q-toolbar-title>
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
          <template v-for="(item, index) in menuItems" :key="index">
            <template v-if="item.show">
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
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/AuthStore'
import { useUserStore } from 'src/stores/UserStore'

const authStore = useAuthStore()
const userStore = useUserStore()

const drawer = ref(false)
const miniState = ref(true)

function toggleDrawer() {
  drawer.value = !drawer.value
}

const menuItems = [
  { label: 'Inicio', icon: 'home', path: '/home', show: true },
  { label: 'Mis citas', icon: 'view_agenda', path: '/appointments', show: true },
  { label: 'Mensajería', icon: 'chat', path: '/chats', show: true },
  { label: 'Informes', icon: 'description', path: '/reports', show: true },
  { label: 'Recetas', icon: 'receipt', path: '/recipes', show: true },
  { label: 'Pruebas y Analíticas', icon: 'science', path: '/tests', show: true, separator: true },
  {
    label: 'Administración',
    icon: 'admin_panel_settings',
    path: '/admin',
    show: userStore.hasRole('ADMIN'),
  },
  {
    label: 'Área profesional',
    icon: 'medical_information',
    path: '/profesional',
    show: userStore.hasRole('PROFESSIONAL'),
  },
  { label: 'Mi perfil', icon: 'person', path: '/profile', show: true },
  { label: 'Ajustes', icon: 'settings', path: '/settings', show: true },
  { label: 'Cerrar sesión', icon: 'logout', show: true, action: () => authStore.logout() },
]
</script>
