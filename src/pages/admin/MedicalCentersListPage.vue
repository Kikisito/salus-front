<script lang="ts" setup>
import DoctorsList from 'src/components/admin/DoctorsList.vue'
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header">
          <div class="text-h6">Centros médicos</div>
          <div class="text-subtitle">
            Aquí puedes ver y gestionar los centros médicos disponibles en la aplicación. Añade,
            edita o elimina centros médicos según sea necesario.
          </div>
        </div>

        <DoctorsList />
      </div>
    </div>
  </q-page>
</template>
