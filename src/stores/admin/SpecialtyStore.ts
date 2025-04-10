import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Especialidad } from 'src/interfaces/Especialidad'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useSpecialtyStore = defineStore('specialties', {
  state: () => ({
    specialties: [] as Especialidad[],
    count: 0,
  }),

  actions: {
    async getAllSpecialties(
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<Especialidad[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/specialties/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.specialties = await response.data.specialties

          return this.specialties
        },
        (error) => {
          throw error
        },
      )
    },

    async searchSpecialties(
      search: string,
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<Especialidad[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/specialties/search/' + search + '/' + page + '/' + limit)
          this.count = await response.data.count
          this.specialties = await response.data.specialties

          return this.specialties
        },
        (error) => {
          throw error
        },
      )
    },

    async getSpecialty(id: number): Promise<ServiceAnswer<Especialidad>> {
      return handleRequest(
        async () => {
          const response = await api.get('/specialties/' + id)
          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async addSpecialty(specialty: Especialidad): Promise<ServiceAnswer<Especialidad>> {
      return handleRequest(
        async () => {
          const response = await api.post('/specialties/add', specialty)
          const newSpecialty = await response.data

          // Añadimos la nueva especialidad a la lista local
          this.specialties.push(newSpecialty)

          return newSpecialty
        },
        (error) => {
          throw error
        },
      )
    },

    async updateSpecialty(specialty: Especialidad): Promise<ServiceAnswer<Especialidad>> {
      return handleRequest(
        async () => {
          const response = await api.put('/specialties/' + specialty.id, specialty)
          const updatedSpecialty = await response.data

          // Actualizamos la especialidad en la lista local
          const index = this.specialties.findIndex((s) => s.id === updatedSpecialty.id)
          if (index !== -1) {
            this.specialties[index] = updatedSpecialty
          }

          return updatedSpecialty
        },
        (error) => {
          throw error
        },
      )
    },

    async deleteSpecialty(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/specialties/' + id)
          const deleted = response.status === 204

          // Eliminamos la especialidad de la lista local
          this.specialties = this.specialties.filter((s) => s.id !== id)

          return deleted
        },
        (error) => {
          throw error
        },
      )
    },
  },
})
