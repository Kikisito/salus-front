<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'
import { ref, type PropType } from 'vue'
import type { MedicalTest } from 'src/interfaces/MedicalTest'
import type { Specialty } from 'src/interfaces/Specialty'
import { transformFileDataToAttachmentData, type Attachment } from 'src/interfaces/Attachment'

const props = defineProps({
  medicalTest: {
    type: Object as PropType<MedicalTest>,
    default: null,
  },
  specialties: {
    type: Array as PropType<Specialty[]>,
    default: () => [],
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  download: {
    type: Function as PropType<(file: Attachment) => void>,
    default: () => {},
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogOK } = useDialogPluginComponent()

const readonly = ref(props.readonly)

// Modelo del formulario usando exactamente los campos de la interfaz
const medicalTest = ref<Partial<MedicalTest>>(
  props.medicalTest || {
    attachments: [],
  },
)

// Input para seleccionar archivos
const filesPendingToUpload = ref<File[]>([])
const fileInput = ref(null)

// Para subir archivos adjuntos
const onFileSelected = (files: FileList | File[] | null) => {
  if (!files || !files.length) return

  // Agregamos los archivos directamente al modelo
  for (let i = 0; i < files.length; i++) {
    filesPendingToUpload.value = [...(filesPendingToUpload.value || []), files[i] as File]
  }

  // Limpiamos el input para permitir seleccionar los mismos archivos nuevamente
  fileInput.value = null
}

// Eliminar un archivo adjunto
const removeAttachment = (index: number) => {
  filesPendingToUpload.value?.splice(index, 1)
}

// Obtener información formateada sobre el archivo
const getFileInfo = (file: Attachment) => {
  // Tamaño en formato legible
  const sizeInKB = file.size / 1024
  const sizeFormatted =
    sizeInKB < 1024 ? `${sizeInKB.toFixed(2)} KB` : `${(sizeInKB / 1024).toFixed(2)} MB`

  return {
    name: file.name,
    size: sizeFormatted,
    type: file.contentType || 'Desconocido',
  }
}

// Determinar el icono según el tipo de archivo
const getFileIcon = (file: Attachment) => {
  const type = file.contentType.toLowerCase()
  if (type.includes('pdf')) return 'picture_as_pdf'
  if (type.includes('image')) return 'image'
  if (type.includes('text')) return 'description'
  return 'insert_drive_file'
}
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 90vw">
      <q-toolbar>
        <q-avatar>
          <q-icon name="science" />
        </q-avatar>

        <q-toolbar-title>Prueba médica</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form
          @submit.prevent="onDialogOK({ medicalTest: medicalTest, files: filesPendingToUpload })"
        >
          <div class="row q-col-gutter-md">
            <!-- Nombre de la prueba -->
            <div class="col-12">
              <q-input
                v-model="medicalTest.name"
                label="Nombre de la prueba"
                :rules="[(val) => !!val || 'El nombre es obligatorio']"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Especialidad -->
            <div class="col-12">
              <q-select
                v-model="medicalTest.specialty"
                :options="specialties"
                option-value="id"
                option-label="name"
                label="Especialidad"
                :rules="[(val) => !!val || 'La especialidad es obligatoria']"
                emit-value
                map-options
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="medicalTest.description"
                type="textarea"
                label="Descripción"
                :rules="[(val) => !!val || 'La descripción es obligatoria']"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Fecha de solicitud -->
            <div class="col-12 col-sm-4">
              <q-input
                v-model="medicalTest.requestedAt"
                type="date"
                label="Fecha de solicitud"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Fecha programada -->
            <div class="col-12 col-sm-4">
              <q-input
                v-model="medicalTest.scheduledAt"
                type="date"
                label="Fecha programada"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Fecha de completado -->
            <div class="col-12 col-sm-4">
              <q-input
                v-model="medicalTest.completedAt"
                type="date"
                label="Fecha de completado"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Resultado -->
            <div class="col-12">
              <q-input
                v-model="medicalTest.result"
                type="textarea"
                label="Resultado"
                :readonly="readonly"
                filled
              />
            </div>

            <!-- Archivos adjuntos -->
            <div class="col-12" v-if="!readonly">
              <q-file
                v-model="fileInput"
                label="Adjuntar archivos"
                filled
                multiple
                @update:model-value="onFileSelected"
                accept=".pdf,.jpg,.jpeg,.png,.docx,.doc,.txt"
                hint="Adjunte informes o imágenes relevantes"
                bottom-slots
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>

            <!-- Lista de archivos adjuntos tipo FILE -->
            <div class="col-12" v-if="filesPendingToUpload && filesPendingToUpload.length > 0">
              <q-list bordered class="rounded-borders q-mt-sm">
                <q-item-label header>
                  Archivos adjuntos

                  <span>
                    ({{
                      (
                        filesPendingToUpload.reduce((acc, file) => acc + file.size, 0) /
                        (1024 * 1024)
                      ).toFixed(2)
                    }}
                    MB)
                  </span>
                </q-item-label>

                <q-item v-for="(file, index) in filesPendingToUpload" :key="index">
                  <q-item-section avatar>
                    <q-icon
                      :name="getFileIcon(transformFileDataToAttachmentData(file))"
                      color="primary"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ file.name }}</q-item-label>
                    <q-item-label caption>
                      {{ getFileInfo(transformFileDataToAttachmentData(file)).size }} |
                      {{ getFileInfo(transformFileDataToAttachmentData(file)).type }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side v-if="!readonly">
                    <q-btn
                      flat
                      round
                      dense
                      color="negative"
                      icon="delete"
                      @click="removeAttachment(index)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Lista de archivos adjuntos tipo ATTACHMENT -->
            <div
              class="col-12"
              v-if="medicalTest && medicalTest.attachments && medicalTest.attachments.length > 0"
            >
              <q-list bordered class="rounded-borders q-mt-sm">
                <q-item-label header>
                  Archivos adjuntos
                  <q-badge color="primary" class="q-ml-sm">
                    {{ medicalTest.attachments.length }}
                  </q-badge>
                </q-item-label>

                <q-item v-for="(file, index) in medicalTest.attachments" :key="index">
                  <q-item-section avatar>
                    <q-icon :name="getFileIcon(file)" color="primary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ file.name }}</q-item-label>
                    <q-item-label caption>
                      {{ getFileInfo(file).size }} |
                      {{ getFileInfo(file).type }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round dense icon="download" @click="download(file)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Observaciones -->
            <div class="col-12">
              <q-input
                v-model="medicalTest.observations"
                type="textarea"
                label="Observaciones"
                :readonly="readonly"
                filled
              />
            </div>
          </div>

          <q-btn class="q-mt-md full-width" color="grey-9" label="Aceptar" type="submit" outline />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
