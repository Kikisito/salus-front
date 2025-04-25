import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Report } from 'src/interfaces/Report'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useReportStore = defineStore('reportStore', {
  state: () => ({
    reports: [] as Report[],
  }),

  actions: {
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
