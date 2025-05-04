import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { useAuthStore } from './AuthStore'

import type { ApiError } from 'src/interfaces/ApiError'
import type { Direccion } from 'src/interfaces/Direccion'
import type { PasswordChangeRequest } from 'src/interfaces/PasswordChangeRequest'
import type { ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as User | null,
    medicalProfile: {} as MedicalProfile,
  }),

  getters: {
    hasRole:
      (state) =>
      (role: string): boolean => {
        return state.user?.rolesList.includes(role) ?? false
      },
  },

  actions: {
    async setUserProfile(user: User | null): Promise<void> {
      this.user = user
    },

    async setMedicalProfile(medicalProfile: MedicalProfile | null): Promise<void> {
      this.medicalProfile = medicalProfile as MedicalProfile
    },

    async getCurrentUser(): Promise<ServiceAnswer<User | null>> {
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

    async getCurrentMedicalProfile(): Promise<ServiceAnswer<MedicalProfile | null>> {
      return handleRequest(async () => {
        const response = await api.get('/doctor-profiles/@me')
        this.medicalProfile = await response.data

        return this.medicalProfile
      })
    },

    async getMedicalProfile(doctorId: number): Promise<ServiceAnswer<MedicalProfile>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/doctor-profiles/${doctorId}`)
          this.medicalProfile = await response.data

          return this.medicalProfile
        },
        (error) => {
          if (error.status === 404) {
            return 'No se ha encontrado el perfil médico'
          }
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

    async changePassword(request: PasswordChangeRequest): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.put('/user/@me/password', request)
          const jwtToken = response.data.jwt

          // Actualizamos el token en el store de autenticación
          const authStore = useAuthStore()
          authStore.setToken(jwtToken)

          // Actualizamos en el usuario local la fecha del último cambio de contraseña
          this.user!.lastPasswordChange = new Date().toISOString()

          return true
        },
        (error) => {
          if (error.status === 404) {
            return 'No se ha encontrado el usuario actual'
          }
          if (error.status === 400 && error.response) {
            const response: ApiError = error.response.data as ApiError
            if (response && response.errors && response.errors[0]) {
              return 'La contraseña actual no coincide con la introducida'
            }
          }
        },
      )
    },

    async closeAllSessions(): Promise<ServiceAnswer<boolean>> {
      return handleRequest(async () => {
        await api.delete('/user/@me/sessions')
        return true
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
