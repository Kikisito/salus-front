<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Dialog, Notify } from 'quasar'

import { useAppointmentStore } from 'src/stores/AppointmentStore'
import { useUsersStore } from 'src/stores/UsersStore'
import { useUserStore } from 'src/stores/UserStore'
import { storeToRefs } from 'pinia'
import { useReportStore } from 'src/stores/ReportStore'
import { usePrescriptionStore } from 'src/stores/PrescriptionStore'
import { useMedicalTestStore } from 'src/stores/MedicalTestStore'
import { useAttachmentStore } from 'src/stores/AttachmentStore'

import PatientData from 'src/components/PatientData.vue'
import DireccionDetails from 'src/components/DireccionDetails.vue'
import AppointmentsHistory from 'src/components/AppointmentsHistory.vue'
import ReportList from 'src/components/ReportList.vue'
import MedicalTestList from 'src/components/MedicalTestList.vue'
import PrescriptionList from 'src/components/PrescriptionList.vue'
import ReportFormDialog from 'src/components/professional/ReportFormDialog.vue'
import PrescriptionFormDialog from 'src/components/professional/PrescriptionFormDialog.vue'
import MedicalTestFormDialog from 'src/components/professional/MedicalTestFormDialog.vue'

import type { User } from 'src/interfaces/User'
import type { Appointment } from 'src/interfaces/Appointment'
import type { Report } from 'src/interfaces/Report'
import type { Prescription } from 'src/interfaces/Prescription'
import type { MedicalTest } from 'src/interfaces/MedicalTest'

const route = useRoute()
const router = useRouter()

const doctorStore = useUserStore()
const { medicalProfile } = storeToRefs(doctorStore)

const userId = parseInt(route.params.id as string)

const usersStore = useUsersStore()
const appointmentStore = useAppointmentStore()
const reportStore = useReportStore()
const prescriptionStore = usePrescriptionStore()
const medicalTestStore = useMedicalTestStore()
const attachmentStore = useAttachmentStore()

const loading = ref(true)
const tab = ref('info')

const patient = ref<User | null>(null)
const appointments = ref<Appointment[]>([])
const reports = ref<Report[]>([])
const prescriptions = ref<Prescription[]>([])
const medicalTests = ref<MedicalTest[]>([])

async function loadPatientData() {
  loading.value = true

  try {
    const response = await usersStore.getUserData(userId)

    if (response.success) {
      patient.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error || 'Error al cargar los datos del paciente',
      })
      router.push({ name: 'professional-patients' })
    }
  } catch (error) {
    console.error('Error al cargar el paciente:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los datos del paciente',
    })
  } finally {
    loading.value = false
  }
}

async function loadPatientAppointments() {
  loading.value = true

  try {
    const response = await appointmentStore.getPatientAppointmentsWithDoctorOrItsSpecialties(
      userId,
      medicalProfile.value.id,
    )

    if (response.success) {
      appointments.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  } finally {
    loading.value = false
  }
}

async function loadPatientReports() {
  loading.value = true

  try {
    const response = await reportStore.getPatientReportsWithDoctorOrItsSpecialties(
      userId,
      medicalProfile.value.id,
    )

    if (response.success) {
      reports.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  } finally {
    loading.value = false
  }
}

async function loadPatientPrescriptions() {
  loading.value = true

  try {
    const response = await prescriptionStore.getPatientPrescriptionsWithDoctorOrItsSpecialties(
      userId,
      medicalProfile.value.id,
    )

    if (response.success) {
      prescriptions.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  } finally {
    loading.value = false
  }
}

async function loadPatientMedicalTests() {
  loading.value = true

  try {
    const response = await medicalTestStore.getPatientMedicalTestsWithDoctorOrItsSpecialties(
      userId,
      medicalProfile.value.id,
    )

    if (response.success) {
      medicalTests.value = response.data
    } else {
      Notify.create({
        type: 'negative',
        message: response.error,
      })
    }
  } finally {
    loading.value = false
  }
}

// Métodos INFORMES
async function openNewReportDialog() {
  Dialog.create({
    component: ReportFormDialog,
    componentProps: {
      specialties: medicalProfile.value.specialties,
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = userId

      // Petición API
      const response = await reportStore.addReport(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe creado correctamente',
        })

        reports.value.push(response.data)
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
      specialties: medicalProfile.value.specialties,
      persistent: true,
      report: { ...report },
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.specialty = report.specialty.id
      data.patient = userId

      // Petición API
      const response = await reportStore.updateReport(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe actualizado correctamente',
        })

        const index = reports.value.findIndex((r) => r.id === report.id)
        if (index !== -1) {
          reports.value[index] = response.data
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

async function deleteReportDialog(report: Report) {
  Dialog.create({
    title: 'Eliminar informe',
    message: '¿Estás seguro de que quieres eliminar este informe?',
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    const response = await reportStore.deleteReport(report.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Informe eliminado correctamente',
      })

      reports.value = reports.value.filter((r) => r.id !== report.id)
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
      specialties: medicalProfile.value.specialties,
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.patient = userId

      // Petición API
      const response = await prescriptionStore.addPrescription(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Receta creada correctamente',
        })

        prescriptions.value.push(response.data)
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
      specialties: medicalProfile.value.specialties,
      prescription: { ...prescription },
      persistent: true,
    },
  }).onOk(async (data) => {
    if (data) {
      // Especificamos el ID del informe y sus datos asociados
      data.doctor = medicalProfile.value.id
      data.specialty = prescription.specialty.id
      data.patient = userId

      // Petición API
      const response = await prescriptionStore.updatePrescription(data)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Receta actualizada correctamente',
        })

        const index = prescriptions.value.findIndex((r) => r.id === prescription.id)
        if (index !== -1) {
          prescriptions.value[index] = response.data
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

      prescriptions.value = prescriptions.value.filter((r) => r.id !== prescription.id)
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
      data.medicalTest.patient = userId

      // Petición API
      const response = await medicalTestStore.addMedicalTest(data.medicalTest, data.files)

      if (response.success) {
        Notify.create({
          type: 'positive',
          message: 'Informe creado correctamente',
        })

        medicalTests.value.push(response.data)
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

async function deleteMedicalTestDialog(medicalTest: MedicalTest) {
  Dialog.create({
    title: 'Eliminar prueba médica',
    message: '¿Estás seguro de que quieres eliminar esta prueba médica?',
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    const response = await medicalTestStore.deleteMedicalTest(medicalTest.id)

    if (response.success) {
      Notify.create({
        type: 'positive',
        message: 'Prueba médica eliminada correctamente',
      })
      medicalTests.value = medicalTests.value.filter((r) => r.id !== medicalTest.id)
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al eliminar la prueba médica: ' + response.error,
      })
    }
  })
}

// FIN MÉTODOS ESPECÍFICOS

onMounted(async () => {
  await loadPatientData()
  await loadPatientAppointments()
  await loadPatientReports()
  await loadPatientPrescriptions()
  await loadPatientMedicalTests()
})
</script>

<template>
  <q-page padding>
    <div class="row justify-evenly">
      <div class="col-12 col-md-9">
        <div class="section-header row items-center">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <template v-if="patient">
            <div>
              <div class="text-h6">{{ patient.nombre }} {{ patient.apellidos }}</div>
              <div class="text-subtitle">Perfil del paciente</div>
            </div>

            <q-btn
              class="q-ml-auto"
              color="primary"
              icon="chat"
              label="Abrir chat"
              @click="$router.push({ name: 'professional-chat', params: { id: patient.id } })"
            />
          </template>
        </div>

        <template v-if="loading">
          <div class="text-center q-pa-md">
            <q-spinner size="3em" color="primary" />
            <div class="text-subtitle1 q-mt-md">Cargando datos del paciente...</div>
          </div>
        </template>

        <template v-else-if="patient">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="info" label="Información" icon="person" />
            <q-tab name="history" label="Historial médico" icon="history" />
            <q-tab name="appointments" label="Citas" icon="event" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Tab información del paciente -->
            <q-tab-panel name="info">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <PatientData :patient="patient" />
                </div>
                <div class="col-12 col-md-6">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="row items-center">
                        <q-icon name="home" class="q-mr-sm" />
                        <div class="text-h6">Dirección</div>
                      </div>
                      <q-separator class="q-my-sm" />
                      <DireccionDetails :direccion="patient.direccion" />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- Tab historial médico -->
            <q-tab-panel name="history">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <ReportList
                    :reports="reports"
                    @report:new="openNewReportDialog()"
                    @report:show="showReportDialog($event)"
                    @report:download_pdf="reportStore.downloadReportPdf($event)"
                    @report:edit="editReportDialog($event)"
                    @report:delete="deleteReportDialog($event)"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <MedicalTestList
                    :medical-tests="medicalTests"
                    @medicaltest:new="openNewMedicalTestDialog()"
                    @medicaltest:show="showMedicalTestDialog($event)"
                    @medicaltest:download_pdf="medicalTestStore.downloadMedicalTestPdf($event)"
                    @medicaltest:delete="deleteMedicalTestDialog($event)"
                  />
                </div>

                <div class="col-12">
                  <PrescriptionList
                    :prescriptions="prescriptions"
                    @prescription:new="openNewPrescriptionDialog()"
                    @prescription:show="showPrescriptionDialog($event)"
                    @prescription:download_pdf="prescriptionStore.downloadPrescriptionPdf($event)"
                    @prescription:edit="updatePrescriptionDialog($event)"
                    @prescription:delete="deletePrescriptionDialog($event)"
                  />
                </div>
              </div>
            </q-tab-panel>

            <!-- Tab histórico de citas -->
            <q-tab-panel name="appointments">
              <AppointmentsHistory
                :appointments="appointments"
                :loading="loading"
                @appointment:show="
                  $router.push({
                    name: 'professional-appointment',
                    params: { id: $event.id },
                  })
                "
              />

              <div class="text-grey text-caption">
                Las citas mostradas corresponden a las citas médicas que el paciente ha tenido
                contigo o alguna de tus especialidades.
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

        <template v-else>
          <q-banner inline-actions class="text-white bg-red">
            <template v-slot:avatar>
              <q-icon name="error" />
            </template>
            <span>
              No se ha podido cargar la información del paciente. Por favor, inténtalo de nuevo más
              tarde.
            </span>
            <template v-slot:action>
              <q-btn
                flat
                label="Volver al listado de pacientes"
                @click="$router.push({ name: 'professional-patients' })"
              />
            </template>
          </q-banner>
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.section-header {
  margin-bottom: 16px;
}

.section-header .q-btn:not(:last-child) {
  margin-right: 10px;
}
</style>
