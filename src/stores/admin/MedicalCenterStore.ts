import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useMedicalCenterStore = defineStore('medicalCenterStore', {
  state: () => ({
    count: 0,
    medicalCenters: [] as MedicalCenter[],
  }),

  actions: {
    async getAllMedicalCenters(
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<MedicalCenter[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/medical-centers/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.medicalCenters = await response.data.medicalCenters

          return this.medicalCenters
        },
        (error) => {
          throw error
        },
      )
    },

    async getMedicalCenter(id: number): Promise<ServiceAnswer<MedicalCenter | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/medical-centers/' + id)
          const medicalCenter = await response.data

          return medicalCenter
        },
        (error) => {
          throw error
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMedicalCenterStore, import.meta.hot))
}
