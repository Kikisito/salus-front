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
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/AuthStore'

const authStore = useAuthStore()

const drawer = ref(false)
const miniState = ref(true)

function toggleDrawer() {
  drawer.value = !drawer.value
}

const menuItems = [
  { label: 'Inicio', icon: 'home', path: '/home' },
  { label: 'Mis citas', icon: 'view_agenda', path: '/appointments' },
  { label: 'Mensajería', icon: 'chat', path: '/chats' },
  { label: 'Informes', icon: 'description', path: '/reports' },
  { label: 'Recetas', icon: 'receipt', path: '/recipes' },
  { label: 'Pruebas y Analíticas', icon: 'science', path: '/tests' },
  { label: 'Tratamientos', icon: 'medical_services', path: '/treatments', separator: true },
  { label: 'Mi perfil', icon: 'person', path: '/profile' },
  { label: 'Ajustes', icon: 'settings', path: '/settings' },
  { label: 'Cerrar sesión', icon: 'logout', action: () => authStore.logout() },
]
</script>
