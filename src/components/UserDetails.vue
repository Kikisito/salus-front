<script lang="ts" setup>
import { formattedDate } from 'src/helpers/formattedDate'
import type { User } from 'src/interfaces/User'
import type { PropType } from 'vue'

defineProps({
  user: {
    type: [Object, null] as PropType<User | null>,
    required: true,
  },
})
</script>

<template>
  <q-list v-if="user">
    <q-item>
      <q-item-section>
        <q-item-label caption>DNI</q-item-label>
        <q-item-label>{{ user?.nif ?? 'No se ha especificado' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Sexo</q-item-label>
        <q-item-label>{{ user?.sexo ?? 'No se ha especificado' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Correo electrónico</q-item-label>
        <q-item-label>{{ user?.email ?? 'No se ha especificado' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Teléfono</q-item-label>
        <q-item-label>{{ user?.telefono ?? 'No se ha especificado' }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label caption>Fecha de nacimiento</q-item-label>
        <q-item-label>
          {{
            user?.fechaNacimiento
              ? formattedDate(new Date(user?.fechaNacimiento))
              : 'No se ha especificado'
          }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

  <span v-else>No se han podido cargar los datos del perfil</span>
</template>
