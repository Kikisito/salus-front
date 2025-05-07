<script setup lang="ts"></script>

<template>
  <div class="error-page flex flex-center">
    <div class="q-pa-md text-center">
      <q-img src="~assets/logo.svg" style="width: 150px" alt="Logo" />

      <div class="text-h2 q-mt-lg text-primary">404</div>
      <div class="q-mt-lg text-h4">Página no encontrada</div>
      <div class="text-body1 q-mt-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </div>

      <div class="row q-col-gutter-md q-mt-lg justify-center">
        <div class="col-12 col-md-6">
          <q-btn color="primary" class="full-width" label="Volver al inicio" icon="home" to="/" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  width: 100%;
}
</style>
