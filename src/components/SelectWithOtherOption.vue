<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: 'Selecciona una opción',
  },
  errors: {
    type: Array,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: null,
  },
})

const selectedOption = defineModel({
  type: String,
  default: '',
})

// Variables internas para manejar el campo adicional
const internalValue = ref(
  props.options.includes(selectedOption.value)
    ? selectedOption.value
    : selectedOption.value.length > 0
      ? 'Otro'
      : '',
)
const otherFieldValue = ref<string | null>(selectedOption.value ?? null)
const showAdditionalField = ref(
  !props.options.includes(selectedOption.value) && selectedOption.value.length > 0,
)

const handleOptionChange = (value: string) => {
  // Mostrar/ocultar campo adicional según la selección
  showAdditionalField.value = value === 'Otro'

  // Limpiar el campo adicional si no es "Otro"
  if (value !== 'Otro') {
    selectedOption.value = value
    otherFieldValue.value = null
  }
}

const handleOtherFieldValueChange = (value: string | number | null) => {
  selectedOption.value = value?.toString() ?? ''
}
</script>

<template>
  <div>
    <q-select
      v-model="internalValue"
      :options="options"
      :label="label"
      :error="errors.length > 0"
      :error-message="errorMessage"
      filled
      @update:model-value="handleOptionChange"
    />

    <!-- Campo adicional que aparece solo cuando se selecciona "Otro" -->
    <q-input
      v-if="showAdditionalField"
      v-model="otherFieldValue"
      label="Especifica tu opción"
      class="q-mt-md"
      outlined
      @update:model-value="handleOtherFieldValueChange"
    />
  </div>
</template>

<style scoped>
/* Estilos opcionales para mejorar la apariencia */
.q-mt-md {
  margin-top: 16px;
}
</style>
