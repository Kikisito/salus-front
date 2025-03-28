<script lang="ts" setup>
import UsersList from 'src/components/admin/UsersList.vue'
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Usuarios registrados</div>
          <div class="text-subtitle">Comprueba los usuarios registrados en la aplicación</div>
        </div>

        <UsersList />
      </div>
    </div>
  </q-page>
</template>
