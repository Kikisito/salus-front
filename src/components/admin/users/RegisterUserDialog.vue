<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import CreateUserStepperForm from 'src/components/user/CreateUserStepperForm.vue'

defineProps({
  randomPassword: {
    type: Boolean,
    default: false,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-toolbar>
        <q-avatar>
          <q-icon name="domain" />
        </q-avatar>

        <q-toolbar-title>Crear usuario</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <CreateUserStepperForm
          :random-password="randomPassword"
          @form:cancel="dialogRef?.hide()"
          @form:submit="onDialogOK($event)"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped>
.q-card {
  width: 700px;
  max-width: 80vw;
}
</style>
