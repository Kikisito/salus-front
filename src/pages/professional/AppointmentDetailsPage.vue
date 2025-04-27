<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Dialog, Notify } from 'quasar'
import AppointmentData from 'src/components/AppointmentData.vue'
import MedicalTestList from 'src/components/MedicalTestList.vue'
import ObservationsInput from 'src/components/ObservationsInput.vue'
import PatientData from 'src/components/PatientData.vue'
import PrescriptionList from 'src/components/PrescriptionList.vue'
import MedicalTestFormDialog from 'src/components/professional/MedicalTestFormDialog.vue'
import PrescriptionFormDialog from 'src/components/professional/PrescriptionFormDialog.vue'
import ReportFormDialog from 'src/components/professional/ReportFormDialog.vue'
import ReportList from 'src/components/ReportList.vue'
import type { Appointment } from 'src/interfaces/Appointment'
import type { MedicalTest } from 'src/interfaces/MedicalTest'
import type { Prescription } from 'src/interfaces/Prescription'
import type { Report } from 'src/interfaces/Report'
import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useAttachmentStore } from 'src/stores/AttachmentStore'
import { useMedicalTestStore } from 'src/stores/MedicalTestStore'
import { usePrescriptionStore } from 'src/stores/PrescriptionStore'
import { useReportStore } from 'src/stores/ReportStore'
import { useUserStore } from 'src/stores/UserStore'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const appointmentId = parseInt(route.params.id as string)

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const appointmentStore = useAppointmentStore()
const reportStore = useReportStore()
const prescriptionStore = usePrescriptionStore()
const medicalTestStore = useMedicalTestStore()
const attachmentStore = useAttachmentStore()

const appointment = ref<Appointment>(null as unknown as Appointment)
const doctorObservationsSynced = ref(true)
const doctorObservationsLoading = ref(false)

// Métodos CITA
async function saveDoctorObservations() {
  if (!appointment.value) return

  doctorObservationsLoading.value = true

  try {
    const response = await appointmentStore.setAppointmentDoctorObservations(
      appointment.value.id,
      appointment.value.doctorObservations,
    )

    Notify.create({
      type: response.success ? 'positive' : 'negative',
      message: response.success ? 'Observaciones guardadas correctamente' : response.error,
    })

    doctorObservationsSynced.value = response.success
  } finally {
    doctorObservationsLoading.value = false
  }
}

async function loadAppointment() {
  if (!appointmentId) {
    Notify.create({
      type: 'negative',
      message: 'ID de cita no válido',
    })
    router.push({ name: 'professional-agenda' })
    return
  }

  try {
    const response = await appointmentStore.getAppointment(appointmentId)

    if (response.success) {
      appointment.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al cargar los datos de la cita: ' + response.error,
      })
      //router.push({ name: 'professional-agenda' })
    }
  } catch (error) {
    console.error('Error al cargar la cita:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar la cita',
    })
  }
}

async function setAppointmentCompleted() {
  setAppointmentStatus(appointment.value.id, 'COMPLETED')
  router.push({ name: 'professional-agenda' })
}

async function setAppointmentStatus(appointmentId: number, status: string) {
  if (!appointment.value) return

  try {
    const response = await appointmentStore.setAppointmentStatus(appointmentId, status)

    Notify.create({
      type: response.success ? 'positive' : 'negative',
      message: response.success ? 'Estado actualizado correctamente' : response.error,
    })

    if (response.success) {
      appointment.value.status = status
    }
  } catch (error) {
    console.error('Error al actualizar el estado de la cita:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar el estado de la cita',
    })
  }
}

// Métodos INFORMES
async function openNewReportDialog() {
  Dialog.create({
    component: ReportFormDialog,
    componentProps: {
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = appointment.value.patient.id
      data.specialty = appointment.value.slot.specialty.id
      data.appointment = appointment.value.id

      // Petición API
      const response = await reportStore.addReport(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe creado correctamente',
        })

        appointment.value.reports.push(response.data)
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al crear el informe: ' + response.error,
        })
      }
    }
  })
}

async function showReportDialog(report: Report) {
  Dialog.create({
    component: ReportFormDialog,
    componentProps: {
      report: report,
      readonly: true,
    },
  })
}

async function editReportDialog(report: Report) {
  Dialog.create({
    component: ReportFormDialog,
    componentProps: {
      persistent: true,
      report: { ...report },
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = appointment.value.patient.id
      data.specialty = appointment.value.slot.specialty.id
      data.appointment = appointment.value.id

      // Petición API
      const response = await reportStore.updateReport(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe actualizado correctamente',
        })

        const index = appointment.value.reports.findIndex((r) => r.id === report.id)
        if (index !== -1) {
          appointment.value.reports[index] = response.data
        }
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al actualizar el informe: ' + response.error,
        })
      }
    }
  })
}

async function deleteReportDialog(reportId: number) {
  Dialog.create({
    title: 'Eliminar informe',
    message: '¿Estás seguro de que quieres eliminar este informe?',
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    const response = await reportStore.deleteReport(reportId)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Informe eliminado correctamente',
      })

      appointment.value.reports = appointment.value.reports.filter((r) => r.id !== reportId)
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al eliminar el informe: ' + response.error,
      })
    }
  })
}

// Métodos RECETAS
async function openNewPrescriptionDialog() {
  Dialog.create({
    component: PrescriptionFormDialog,
    componentProps: {
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = appointment.value.patient.id
      data.appointment = appointment.value.id
      data.specialty = appointment.value.slot.specialty.id

      // Petición API
      const response = await prescriptionStore.addPrescription(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Receta creada correctamente',
        })

        appointment.value.prescriptions.push(response.data)
      } else {
        Notify.create({
          type: 'negative',
          message: response.error,
        })
      }
    }
  })
}

async function updatePrescriptionDialog(prescription: Prescription) {
  Dialog.create({
    component: PrescriptionFormDialog,
    componentProps: {
      prescription: { ...prescription },
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = appointment.value.patient.id
      data.appointment = appointment.value.id
      data.specialty = appointment.value.slot.specialty.id

      // Petición API
      const response = await prescriptionStore.updatePrescription(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Receta actualizada correctamente',
        })

        const index = appointment.value.prescriptions.findIndex((r) => r.id === prescription.id)
        if (index !== -1) {
          appointment.value.prescriptions[index] = response.data
        }
      } else {
        Notify.create({
          type: 'negative',
          message: response.error,
        })
      }
    }
  })
}

async function showPrescriptionDialog(prescription: Prescription) {
  Dialog.create({
    component: PrescriptionFormDialog,
    componentProps: {
      prescription: prescription,
      readonly: true,
    },
  })
}

async function deletePrescriptionDialog(prescription: Prescription) {
  Dialog.create({
    title: 'Eliminar receta',
    message: '¿Estás seguro de que quieres eliminar esta receta?',
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    const response = await prescriptionStore.deletePrescription(prescription.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Receta eliminada correctamente',
      })

      appointment.value.prescriptions = appointment.value.prescriptions.filter(
        (r) => r.id !== prescription.id,
      )
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  })
}

// Métodos PRUEBAS MÉDICAS
async function openNewMedicalTestDialog() {
  Dialog.create({
    component: MedicalTestFormDialog,
    componentProps: {
      specialties: medicalProfile.value.specialties,
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.medicalTest.doctor = medicalProfile.value.id
      data.medicalTest.patient = appointment.value.patient.id
      data.medicalTest.appointment = appointment.value.id

      // Petición API
      const response = await medicalTestStore.addMedicalTest(data.medicalTest, data.files)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe creado correctamente',
        })

        appointment.value.medicalTests.push(response.data)
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al crear el informe: ' + response.error,
        })
      }
    }
  })
}

async function showMedicalTestDialog(medicalTest: MedicalTest) {
  Dialog.create({
    component: MedicalTestFormDialog,
    componentProps: {
      medicalTest: medicalTest,
      readonly: true,
      download: attachmentStore.downloadAttachment,
    },
  })
}

async function deleteMedicalTestDialog(medicalTestId: number) {
  Dialog.create({
    title: 'Eliminar prueba médica',
    message: '¿Estás seguro de que quieres eliminar esta prueba médica?',
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    const response = await medicalTestStore.deleteMedicalTest(medicalTestId)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Prueba médica eliminada correctamente',
      })
      appointment.value.medicalTests = appointment.value.medicalTests.filter(
        (r) => r.id !== medicalTestId,
      )
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al eliminar la prueba médica: ' + response.error,
      })
    }
  })
}

onMounted(async () => {
  await loadAppointment()
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div>
            <div class="text-h6">
              {{ medicalProfile.user.nombre }} {{ medicalProfile.user.apellidos }}
            </div>
            <div class="text-subtitle">Número de colegiado: {{ medicalProfile.license }}</div>

            <q-badge
              v-for="specialty in medicalProfile.specialties"
              :key="specialty.id"
              color="secondary"
              class="q-mr-xs q-mb-xs"
              text-color="white"
            >
              {{ specialty.name }}
            </q-badge>

            <q-badge v-if="medicalProfile.specialties?.length <= 0" color="grey" text-color="white">
              Sin especialidades
            </q-badge>
          </div>

          <q-space />

          <q-btn
            color="negative"
            label="Finalizar cita"
            icon="check_circle"
            :disable="appointment?.status !== 'PENDING'"
            @click="setAppointmentCompleted()"
          />
        </div>

        <template v-if="appointment">
          <div class="row q-col-gutter-md q-mt-md">
            <!-- Información del paciente -->
            <div class="col-12 col-md-6">
              <PatientData :patient="appointment.patient" />
            </div>

            <!-- Detalles de la cita -->
            <div class="col-12 col-md-6">
              <AppointmentData
                :appointment="appointment"
                @appointment:set-status="setAppointmentStatus($event.appointment.id, $event.status)"
                editable-status
              />
            </div>

            <!-- Observaciones de la consulta -->
            <div class="col-12">
              <ObservationsInput
                v-model:observations="appointment.doctorObservations"
                v-model:loading="doctorObservationsLoading"
                v-model:saved="doctorObservationsSynced"
                @observations:update="saveDoctorObservations()"
              />
            </div>

            <!-- Informes -->
            <div class="col-12 col-md-6">
              <ReportList
                :reports="appointment.reports"
                @report:new="openNewReportDialog()"
                @report:show="showReportDialog($event)"
                @report:download_pdf="reportStore.downloadReportPdf($event)"
                @report:edit="editReportDialog($event)"
                @report:delete="deleteReportDialog($event)"
              />
            </div>

            <!-- Recetas -->
            <div class="col-12 col-md-6">
              <PrescriptionList
                :prescriptions="appointment.prescriptions"
                @prescription:new="openNewPrescriptionDialog()"
                @prescription:show="showPrescriptionDialog($event)"
                @prescription:edit="updatePrescriptionDialog($event)"
                @prescription:download_pdf="prescriptionStore.downloadPrescriptionPdf($event)"
                @prescription:delete="deletePrescriptionDialog($event)"
              />
            </div>

            <!-- Pruebas médicas -->
            <div class="col-12">
              <MedicalTestList
                :medical-tests="appointment.medicalTests"
                @medicaltest:new="openNewMedicalTestDialog()"
                @medicaltest:show="showMedicalTestDialog($event)"
                @medicaltest:download_pdf="medicalTestStore.downloadMedicalTestPdf($event)"
                @medicaltest:delete="deleteMedicalTestDialog($event)"
              />
            </div>
          </div>
        </template>

        <div v-else class="text-center q-pa-xl">
          <q-spinner size="3em" color="primary" />
          <div class="text-subtitle1 q-mt-md">Cargando datos de la cita...</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="css" scoped>
.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
