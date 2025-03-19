import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { PerfilMedico } from 'src/interfaces/PerfilMedico'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useDoctorStore = defineStore('doctorStore', {
  state: () => ({
    count: 0,
    doctors: [] as PerfilMedico[],
    inspectedDoctor: null as PerfilMedico | null,
  }),

  actions: {
    async getAll(
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<PerfilMedico[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/doctor-profiles/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.doctors = await response.data.doctors

          return this.doctors
        },
        (error) => {
          throw error
        },
      )
    },

    async search(
      search: string,
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<PerfilMedico[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/user/search/' + search + '/' + page + '/' + limit)
          this.count = await response.data.count
          this.doctors = await response.data.doctors

          return this.doctors
        },
        (error) => {
          throw error
        },
      )
    },

    async getDoctorData(id: number): Promise<ServiceAnswer<PerfilMedico | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/doctor-profiles/' + id)
          this.inspectedDoctor = response.data as PerfilMedico

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDoctorStore, import.meta.hot))
}
