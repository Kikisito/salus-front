import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Attachment } from 'src/interfaces/Attachment'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useAttachmentStore = defineStore('attachmentStore', {
  actions: {
    async downloadAttachment(attachment: Attachment): Promise<ServiceAnswer<Blob>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/attachments/${attachment.id}/download`, {
            responseType: 'blob',
          })
          const pdfBlob = await response.data

          const url = window.URL.createObjectURL(pdfBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${attachment.name}`
          link.click()
          window.URL.revokeObjectURL(url)

          return pdfBlob
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener este archivo.'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttachmentStore, import.meta.hot))
}
