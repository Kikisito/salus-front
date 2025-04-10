import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Direccion } from 'src/interfaces/Direccion'
import type { PerfilMedico } from 'src/interfaces/PerfilMedico'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    count: 0,
    users: [] as User[],
    inspectedUser: null as User | null,
  }),

  actions: {
    async getAllUsers(page: number = 0, limit: number = 10): Promise<ServiceAnswer<User[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/user/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.users = await response.data.users

          return this.users
        },
        (error) => {
          throw error
        },
      )
    },

    async searchUsers(
      search: string,
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<User[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/user/search/' + search + '/' + page + '/' + limit)
          this.count = await response.data.count
          this.users = await response.data.users

          return this.users
        },
        (error) => {
          throw error
        },
      )
    },

    async getUserData(id: number): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/user/' + id)
          this.inspectedUser = response.data as User

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async updateProfile(id: number, data: User): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.put('/user/' + id, data)
          this.inspectedUser = response.data as User

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async setAddress(id: number, data: Direccion): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.put('/user/' + id + '/address', data)
          this.inspectedUser = response.data as User

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async restrictUser(id: number, restrict: boolean): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.put('/user/' + id + '/restrict', {
            restrict: restrict,
          })
          this.inspectedUser = response.data as User

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    // Medico
    async convertToProfessional(
      id: number,
      license: string,
    ): Promise<ServiceAnswer<PerfilMedico | null>> {
      return handleRequest(
        async () => {
          const response = await api.post('/doctor-profiles/add', {
            userId: id,
            license: license,
          })
          this.inspectedUser = response.data.user as User

          return response.data
        },
        (error) => {
          if (error.status === 409) {
            return 'El usuario ya está registrado como profesional o la licencia ya está en uso'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
