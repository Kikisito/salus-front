import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { Filesystem, Directory } from '@capacitor/filesystem'
import blobToBase64 from 'src/helpers/blobToBase64'

import type { Prescription } from 'src/interfaces/Prescription'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const usePrescriptionStore = defineStore('prescriptionStore', {
  state: () => ({
    prescriptions: [] as Prescription[],
  }),

  actions: {
    async getUserPrescriptions(userId: number): Promise<ServiceAnswer<Prescription[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/prescriptions/patient/${userId}`)
          const prescriptions = await response.data
          this.prescriptions = prescriptions
          return prescriptions
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener las recetas.'
          }
        },
      )
    },

    async getPatientPrescriptionsWithDoctorOrItsSpecialties(
      userId: number,
      doctorId: number,
    ): Promise<ServiceAnswer<Prescription[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/prescriptions/patient/${userId}/doctor/${doctorId}`)
          const prescriptions = await response.data
          return prescriptions
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener las recetas.'
          }
        },
      )
    },

    async downloadPrescriptionPdf(prescription: Prescription): Promise<ServiceAnswer<Blob>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/prescriptions/${prescription.id}/pdf`, {
            responseType: 'blob',
          })
          const pdfBlob = await response.data

          const url = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Prescription-${prescription.patient.nif}.pdf`
          link.click()
          window.URL.revokeObjectURL(url)

          Filesystem.writeFile({
            path: `Prescription-${prescription.patient.nif}.pdf`,
            data: await blobToBase64(pdfBlob),
            directory: Directory.Documents,
            recursive: true,
          })

          return pdfBlob
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener la receta.'
          }
        },
      )
    },

    async addPrescription(data: Prescription): Promise<ServiceAnswer<Prescription>> {
      return handleRequest(
        async () => {
          const response = await api.post('/prescriptions/add', data)

          const prescription = await response.data
          return prescription
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al añadir el informe.'
          }
        },
      )
    },

    async updatePrescription(data: Prescription): Promise<ServiceAnswer<Prescription>> {
      return handleRequest(
        async () => {
          const response = await api.put(`/prescriptions/${data.id}`, data)
          const prescription = await response.data
          return prescription
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al actualizar el informe.'
          }
        },
      )
    },

    async deletePrescription(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete(`/prescriptions/${id}`)
          return response.status === 204
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al eliminar el informe.'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrescriptionStore, import.meta.hot))
}
