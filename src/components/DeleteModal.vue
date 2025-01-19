<script lang="ts" setup>
defineEmits(['form:confirm-delete'])

const showModal = defineModel('show', { default: false, type: Boolean })
</script>

<template>
  <q-dialog v-model="showModal">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Eliminar</div>
      </q-card-section>

      <q-card-section>
        <span
          >Esta acción es <b>irreversible</b>. Por favor, pulsa el botón <i>Eliminar</i> para
          confirmar la acción.</span
        >
      </q-card-section>

      <q-card-section>
        <div class="actions">
          <q-btn color="red" flat label="Eliminar" @click="$emit('form:confirm-delete')" />
          <q-btn color="primary" label="Cancelar" @click="showModal = false" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
