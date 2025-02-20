<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import SelectWithOtherOption from 'src/components/SelectWithOtherOption.vue'

const props = defineProps(['entity', 'entityValidationConfig', 'readOnly'])
const emit = defineEmits(['form:validated'])

const { validationSchema, initialValues, formFieldsConfig } = props.entityValidationConfig

const { handleSubmit } = useForm({
  validationSchema: validationSchema,
  initialValues: initialValues,
})

/* Esto esquivale a...
    formFields = ref({
        field1: { ...formFieldsConfig.field1, model: useField('field1') },
        field2: { ...formFieldsConfig.field2, model: useField('field2') },
        ...
    })
*/
const formFields = ref(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Object.keys(formFieldsConfig).reduce((acc: any, key: string) => {
    acc[key] = { ...formFieldsConfig[key], model: useField(key) }
    return acc
  }, {}),
  /* eslint-enable @typescript-eslint/no-explicit-any */
)

// Actualizamos la entidad cuando es actualizada en la lista del componente padre
watch(
  () => props.entity,
  (newValue) => {
    if (newValue) {
      Object.keys(formFields.value).forEach((key: string) => {
        formFields.value[key].model.value = newValue[key]
      })
    }
  },
  { deep: true },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFieldChange = (field: any, value: any) => {
  field.model.value = field.onChange ? field.onChange(value) : value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const doSubmit = handleSubmit(async (values: any) => {
  emit('form:validated', values)
})
</script>

<template>
  <q-form @submit.prevent="doSubmit">
    <template v-for="field in formFields" :key="field">
      <SelectWithOtherOption
        v-if="field.type === 'select-with-other'"
        v-model="field.model.value"
        :label="field.label"
        :hint="field.hint"
        :dense="field.dense"
        :options="field.options"
        :errors="field.model.errors"
        :errorMessage="field.model.errorMessage"
        :clearable="field.clearable"
        :disable="readOnly || field.readOnly"
        filled
      />

      <q-select
        v-else-if="field.type === 'select'"
        v-model="field.model.value"
        :label="field.label"
        :hint="field.hint"
        :dense="field.dense"
        :options="field.options"
        :option-label="field.options.label"
        :option-value="field.options.value"
        :errors="field.model.errors"
        :error="field.model.errors.length != 0"
        :error-message="field.model.errorMessage"
        :clearable="field.clearable"
        :disable="readOnly || field.readOnly"
        filled
      />

      <q-input
        v-else
        v-model="field.model.value"
        :type="field.type"
        :step="field.type === 'number' ? field.step : undefined"
        :label="field.label"
        :placeholder="field.placeholder"
        :hint="field.hint"
        :dense="field.dense"
        :error="field.model.errors.length != 0"
        :error-message="field.model.errorMessage"
        :autocomplete="field.autocomplete"
        :readonly="readOnly || field.readOnly"
        filled
        @update:model-value="handleFieldChange(field, $event)"
      />
    </template>

    <slot name="extraFields" />

    <div class="actions">
      <slot name="submitButton" />
    </div>
  </q-form>
</template>

<style lang="css" scoped>
.actions {
  display: flex;
  justify-content: space-between;
}

.q-field:has(.q-field__messages) {
  margin-bottom: 0.5rem;
}

.q-input:has(.q-field__messages) {
  margin-bottom: 0.5rem;
}
</style>
