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

    async getMedicalCenter(id: number): Promise<ServiceAnswer<MedicalCenter>> {
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

    async addMedicalCenter(medicalCenter: MedicalCenter): Promise<ServiceAnswer<MedicalCenter>> {
      return handleRequest(
        async () => {
          const response = await api.post('/medical-centers/add', medicalCenter)
          const newMedicalCenter = await response.data

          // Añadimos el nuevo centro médico a la lista local
          this.medicalCenters.push(newMedicalCenter)

          return newMedicalCenter
        },
        (error) => {
          throw error
        },
      )
    },

    async updateMedicalCenter(medicalCenter: MedicalCenter): Promise<ServiceAnswer<MedicalCenter>> {
      return handleRequest(
        async () => {
          const response = await api.put('/medical-centers/' + medicalCenter.id, medicalCenter)
          const updatedMedicalCenter = await response.data

          // Actualizamos el centro médico en la lista local
          const index = this.medicalCenters.findIndex((mc) => mc.id === updatedMedicalCenter.id)
          if (index !== -1) {
            this.medicalCenters[index] = updatedMedicalCenter
          }

          return updatedMedicalCenter
        },
        (error) => {
          throw error
        },
      )
    },

    async deleteMedicalCenter(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/medical-centers/' + id)
          const deleted = response.status === 204

          // Eliminamos el centro médico de la lista local
          this.medicalCenters = this.medicalCenters.filter((mc) => mc.id !== id)

          return deleted
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
