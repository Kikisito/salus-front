<script lang="ts" setup>
import { HeFilledMedicines } from '@kalimahapps/vue-icons'
import { formattedDate } from 'src/helpers/formattedDate'
import { computed, ref } from 'vue'

const props = defineProps(['receta'])

const expanded = ref(false)

const estadoReceta = computed(() => {
  const hoy = new Date()
  const fechaFin = new Date(props.receta.fecha_fin)
  return hoy <= fechaFin ? 'Activa' : 'Caducada'
})

const estadoMedicamento = (medicamento: unknown) => {
  const hoy = new Date()
  // @ts-expect-error Especificar el tipo de medicamento en el futuro
  const fechaFin = new Date(medicamento.fecha_fin)
  return hoy <= fechaFin ? 'Activo' : 'Caducado'
}
</script>

<template>
  <q-card flat bordered>
    <q-expansion-item v-model="expanded" expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <HeFilledMedicines
            :class="estadoReceta === 'Activa' ? 'text-green' : 'text-red'"
            class="text-h4"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ props.receta.especialidad }}</q-item-label>
          <q-item-label caption>{{ props.receta.doctor }}</q-item-label>
          <q-item-label caption>
            {{ formattedDate(props.receta.fecha_inicio) }} hasta
            {{ formattedDate(props.receta.fecha_fin) }}
          </q-item-label>
          <q-item-label caption :class="estadoReceta === 'Activa' ? 'text-green' : 'text-red'"
            >Estado: {{ estadoReceta }}</q-item-label
          >
        </q-item-section>
      </template>

      <q-card-section>
        <div class="text-body1">Medicamentos:</div>
        <q-list bordered>
          <template v-for="(medicamento, index) in props.receta.medicamentos" :key="index">
            <q-item>
              <q-item-section>
                <q-item-label
                  :class="estadoMedicamento(medicamento) === 'Caducado' ? 'text-strike' : ''"
                >
                  {{ medicamento.nombre }}
                </q-item-label>
                <q-item-label caption>Pauta: {{ medicamento.pauta }}</q-item-label>
                <q-item-label caption>
                  Hasta el {{ formattedDate(medicamento.fecha_fin) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator inset v-if="index < props.receta.medicamentos.length - 1" />
          </template>
        </q-list>

        <q-card-actions align="center">
          <q-btn class="q-mt-sm" label="Descargar receta" color="primary" icon="download" />
        </q-card-actions>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<style scoped>
.q-list {
  border-radius: 0.25rem;
  background-color: white;
}

.q-list:hover {
  transition: background-color 0.5s;
  background-color: #f5f5f5;
}
</style>
