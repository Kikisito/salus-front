<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(true)

const buttons = [
  {
    title: 'Ver mis citas',
    caption: 'Gestiona tus próximas consultas médicas',
    icon: 'event',
    color: 'primary',
    route: 'professional-agenda',
  },
  {
    title: 'Ver mis chats',
    caption: 'Consulta tus mensajes con pacientes',
    icon: 'chat',
    color: 'green',
    route: 'professional-chats',
  },
  {
    title: 'Ver mis pacientes',
    caption: 'Consulta tus pacientes y su información',
    icon: 'people',
    color: 'amber',
    route: 'professional-patients',
  },
]

onMounted(() => {
  // No need to fetch counts anymore
  loading.value = false
})
</script>

<template>
  <q-page padding>
    <div v-if="!loading" class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h5">Área profesional</div>
          <div class="text-subtitle">
            Bienvenido al centro de gestión para profesionales sanitarios
          </div>
        </div>

        <div class="q-mt-lg">
          <div class="text-h6">Accesos directos</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4" v-for="(action, index) in buttons" :key="index">
            <q-card
              class="cursor-pointer q-card-selectable"
              v-ripple
              flat
              bordered
              @click="$router.push({ name: action.route })"
            >
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ action.title }}</div>
                    <div class="text-caption">{{ action.caption }}</div>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      round
                      :color="action.color"
                      :icon="action.icon"
                      @click="$router.push({ name: action.route })"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-spinner size="3em" color="primary" />
      <div class="text-subtitle1 q-mt-md">Cargando...</div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header {
  margin-bottom: 16px;
}
</style>
