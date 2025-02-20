import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { ApiError } from 'src/interfaces/ApiError'
import type { Direccion } from 'src/interfaces/Direccion'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    async setUserProfile(user: User | null): Promise<void> {
      this.user = user
    },

    async getCurrentProfile(): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/user/@me')
          this.user = await response.data

          return this.user
        },
        (error) => {
          throw error
        },
      )
    },

    async updateProfile(newData: User): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.patch('/user/@me', newData)
          this.user = await response.data
          return this.user
        },
        (error) => {
          if (error.status === 404) {
            return 'No se ha encontrado el usuario actual'
          } else if (error.status === 409) {
            // Los datos introducidos ya corresponden a otro usuario (puede ser cualquier campo único)
            const response: ApiError = error.response?.data as ApiError
            if (response && response.errors && response.errors[0]) {
              return response.errors[0].message // Mostraremos siempre el primer error, mostrar varios puede abrumar al usuario
            }
          }
        },
      )
    },

    async setAddress(address: Direccion): Promise<ServiceAnswer<User | null>> {
      return handleRequest(
        async () => {
          const response = await api.put('/user/@me/address', address)
          this.user = await response.data
          return this.user
        },
        (error) => {
          if (error.status === 404) {
            return 'No se ha encontrado el usuario actual'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
