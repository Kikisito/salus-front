<script lang="ts" setup>
import RoomsList from 'src/components/admin/rooms/RoomsList.vue'
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Consultas</div>
          <div class="text-subtitle">Listado de consultas médicas registradas en el sistema</div>
        </div>

        <RoomsList />
      </div>
    </div>
  </q-page>
</template>
