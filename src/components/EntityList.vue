<script lang="ts" setup>
import { onMounted, ref, toRef } from 'vue'

const props = defineProps({
  tableTitle: {
    type: String,
    default: 'Listado de entidades',
  },
  entities: {
    type: Array,
    required: true,
  },
})

defineEmits(['table:request'])

const entities = toRef(props, 'entities')

// Referencia a la tabla en sí
const tableRef = ref()

// Filtro de búsqueda y datos de paginación
const filter = ref('')

// Carga inicial de datos de la tabla
onMounted(async () => {
  tableRef.value.requestServerInteraction()
})
</script>

<template>
  <q-table
    ref="tableRef"
    :title="props.tableTitle"
    :rows="entities"
    :filter="filter"
    :pagination-label="(start, end, total) => `${start} - ${end} de ${total}`"
    rows-per-page-label="Filas por página"
    :rows-per-page-options="[5, 10, 25, 50, 100]"
    no-data-label="No hay datos disponibles"
    no-results-label="No se encontraron resultados"
    @request="$emit('table:request', $event)"
    flat
    bordered
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell-actions="props">
      <slot name="actions" v-bind="props" />
    </template>
  </q-table>
</template>

<style scoped>
.q-table__container {
  background-color: #f7faff;
}

.actions-column > .q-btn:not(:last-child) {
  margin-right: 0.25rem;
}
</style>
