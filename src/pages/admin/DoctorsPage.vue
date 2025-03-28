<script lang="ts" setup>
import DoctorsList from 'src/components/admin/DoctorsList.vue'
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Médicos</div>
          <div class="text-subtitle">Listado de médicos registrados</div>
        </div>

        <DoctorsList />
      </div>
    </div>
  </q-page>
</template>
