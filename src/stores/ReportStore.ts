import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { Filesystem, Directory } from '@capacitor/filesystem'
import blobToBase64 from 'src/helpers/blobToBase64'

import type { Report } from 'src/interfaces/Report'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import { Notify } from 'quasar'

export const useReportStore = defineStore('reportStore', {
  state: () => ({
    reports: [] as Report[],
  }),

  persist: {
    storage: localStorage,
    pick: ['reports'],
  },

  actions: {
    async getUserReports(userId: number): Promise<ServiceAnswer<Report[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/reports/user/${userId}`)
          const reports = await response.data
          this.reports = reports
          return reports
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener los informes.'
          }
        },
      )
    },

    async getPatientReportsWithDoctorOrItsSpecialties(
      userId: number,
      doctorId: number,
    ): Promise<ServiceAnswer<Report[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/reports/patient/${userId}/doctor/${doctorId}`)
          const reports = await response.data
          return reports
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener los informes.'
          }
        },
      )
    },

    async addReport(data: Report): Promise<ServiceAnswer<Report>> {
      return handleRequest(
        async () => {
          const response = await api.post('/reports/add', data)

          const report = await response.data
          return report
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

    async updateReport(data: Report): Promise<ServiceAnswer<Report>> {
      return handleRequest(
        async () => {
          const response = await api.put(`/reports/${data.id}`, data)
          const report = await response.data
          return report
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

    async deleteReport(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete(`/reports/${id}`)
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

    async downloadReportPdf(report: Report): Promise<ServiceAnswer<Blob>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/reports/${report.id}/pdf`, {
            responseType: 'blob',
          })
          const pdfBlob = await response.data

          const url = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Report-${report.patient.nif}.pdf`
          link.click()
          window.URL.revokeObjectURL(url)

          Filesystem.writeFile({
            path: `Report-${report.patient.nif}.pdf`,
            data: await blobToBase64(pdfBlob),
            directory: Directory.Documents,
            recursive: true,
          })

          Notify.create({
            message: 'Informe descargado correctamente. Revisa tu carpeta de Documentos.',
            type: 'positive',
          })

          return pdfBlob
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener el informe.'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReportStore, import.meta.hot))
}
