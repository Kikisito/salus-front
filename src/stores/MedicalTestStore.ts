import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { Filesystem, Directory } from '@capacitor/filesystem'
import blobToBase64 from 'src/helpers/blobToBase64'

import type { MedicalTest } from 'src/interfaces/MedicalTest'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import { Notify } from 'quasar'

export const useMedicalTestStore = defineStore('medicalTestStore', {
  state: () => ({
    tests: [] as MedicalTest[],
  }),

  persist: {
    storage: localStorage,
    pick: ['tests'],
  },

  actions: {
    async getUserMedicalTests(userId: number): Promise<ServiceAnswer<MedicalTest[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/medical-tests/patient/${userId}`)
          const tests = await response.data
          this.tests = tests
          return tests
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener las pruebas médicas.'
          }
        },
      )
    },

    async getPatientMedicalTestsWithDoctorOrItsSpecialties(
      userId: number,
      doctorId: number,
    ): Promise<ServiceAnswer<MedicalTest[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/medical-tests/patient/${userId}/doctor/${doctorId}`)
          const tests = await response.data
          return tests
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener las pruebas médicas.'
          }
        },
      )
    },

    async downloadMedicalTestPdf(medicalTest: MedicalTest): Promise<ServiceAnswer<Blob>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/medical-tests/${medicalTest.id}/pdf`, {
            responseType: 'blob',
          })
          const pdfBlob = await response.data

          const url = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Medical-Test-${medicalTest.patient.nif}.pdf`
          link.click()
          window.URL.revokeObjectURL(url)

          Filesystem.writeFile({
            path: `Medical-Test-${medicalTest.patient.nif}.pdf`,
            data: await blobToBase64(pdfBlob),
            directory: Directory.Documents,
            recursive: true,
          })

          Notify.create({
            message: 'Prueba médica descargada correctamente. Revisa tu carpeta de Documentos',
            type: 'positive',
          })

          return pdfBlob
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener la prueba médica.'
          }
        },
      )
    },

    async addMedicalTest(
      medicalTestData: MedicalTest,
      attachments: File[],
    ): Promise<ServiceAnswer<MedicalTest>> {
      return handleRequest(
        async () => {
          const formData = new FormData()

          // Add the medical test data as a JSON part named "medicalTestRequest"
          formData.append(
            'medicalTestRequest',
            new Blob([JSON.stringify(medicalTestData)], { type: 'application/json' }),
          )

          // Add files if they exist
          if (attachments && attachments.length > 0) {
            attachments.forEach((file) => {
              formData.append('files', file)
            })
          }

          const response = await api.post('/medical-tests/add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          const report = await response.data
          return report
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else if (error.status === 413) {
            return 'Has introducido un archivo demasiado grande o el tamaño total de los archivos supera el límite permitido.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al añadir la prueba médica.'
          }
        },
      )
    },

    async deleteMedicalTest(medicalTestId: number): Promise<ServiceAnswer<MedicalTest>> {
      return handleRequest(
        async () => {
          const response = await api.delete(`/medical-tests/${medicalTestId}`)
          const report = await response.data
          return report
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al eliminar la prueba médica.'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMedicalTestStore, import.meta.hot))
}
