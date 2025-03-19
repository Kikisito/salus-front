<script lang="ts" setup>
import type { Direccion } from 'src/interfaces/Direccion'
import type { PropType } from 'vue'

defineProps({
  direccion: {
    type: [Object, null] as PropType<Direccion | null>,
    required: true,
  },
})
</script>

<template>
  <q-list v-if="direccion">
    <q-item>
      <q-item-section>
        <q-item-label caption>Línea de Dirección 1</q-item-label>
        <q-item-label>
          {{ direccion.lineaDireccion1 ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Línea de Dirección 2</q-item-label>
        <q-item-label>
          {{ direccion.lineaDireccion2 ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Código Postal</q-item-label>
        <q-item-label>
          {{ direccion.codigoPostal ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Provincia</q-item-label>
        <q-item-label>
          {{ direccion.provincia ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Municipio</q-item-label>
        <q-item-label>
          {{ direccion.municipio ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Localidad</q-item-label>
        <q-item-label>
          {{ direccion.localidad ?? 'No se ha especificado' }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

  <span v-else>No hay ninguna dirección asociada</span>
</template>
