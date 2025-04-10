<script lang="ts" setup>
import SpecialtiesList from 'src/components/admin/specialties/SpecialtiesList.vue'
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Especialidades</div>
          <div class="text-subtitle">
            Listado de especialidades médicas disponibles en el sistema
          </div>
        </div>

        <SpecialtiesList />
      </div>
    </div>
  </q-page>
</template>
