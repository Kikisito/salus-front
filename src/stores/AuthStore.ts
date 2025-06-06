import { defineStore, acceptHMRUpdate } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'
import { useUserStore } from './UserStore'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null as string | null,
  }),

  persist: {
    storage: localStorage,
    pick: ['token'],
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string): Promise<ServiceAnswer<string>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/login', {
            nif: username,
            password: password,
          })
          const data = await response.data

          this.token = data.jwt

          return data.jwt
        },
        (error) => {
          if (error.status === 404) {
            return 'Los datos introducidos no coinciden con ningún usuario'
          } else if (
            error.status === 401 &&
            // @ts-expect-error objeto del servidor
            error.response?.data.errors[0].code === 'generic.account_locked'
          ) {
            return 'Esta cuenta está bloqueada. Restablece la contraseña para desbloquearla.'
          }
        },
      )
    },

    async register(user: User): Promise<ServiceAnswer<number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/register', user)

          const data = await response.data
          this.token = data.jwt

          return data
        },
        (error) => {
          if (error.status === 409) {
            return 'El correo electrónico o NIF introducido ya está en uso'
          }
        },
      )
    },

    async logout() {
      return handleRequest(async () => {
        try {
          const response = await api.post('/auth/logout')
          const result = response.status

          if (result !== 200) {
            Notify.create({
              message:
                'Ha ocurrido un error al cerrar sesión, pero no te preocupes, tu sesión en este dispositivo ha sido cerrada',
              color: 'negative',
              icon: 'error',
            })
          }
        } finally {
          const userStore = useUserStore()
          this.token = null
          userStore.setUserProfile(null)
          this.router.push({ name: 'login' })
        }
      })
    },

    async requestPasswordReset(email: string, nif: string): Promise<ServiceAnswer<number>> {
      return handleRequest(async () => {
        const response = await api.post('/auth/forgot-password/request', {
          email: email,
          nif: nif,
        })
        return response.status
      })
    },

    async resetPassword(token: string, password: string): Promise<ServiceAnswer<number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/forgot-password/reset', {
            token: token,
            password: password,
          })
          return response.status
        },
        (error) => {
          if (error.status === 404) {
            return 'El enlace de recuperación de contraseña no es válido'
          }
        },
      )
    },

    async requestEmailVerification(): Promise<ServiceAnswer<number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/verification/resend', {})
          return response.status
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error inesperado'
        },
      )
    },

    async verifyEmail(token: string): Promise<ServiceAnswer<number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/verification/verify', {
            token: token,
          })
          return response.status
        },
        (error) => {
          if (error.status === 409) {
            return 'Este correo electrónico ya ha sido verificado'
          } else if (error.status === 400) {
            return 'El enlace de verificación no es válido, ha expirado o ya ha sido utilizado'
          } else {
            console.error(error)
            return 'Ha ocurrido un error inesperado'
          }
        },
      )
    },

    async checkEmail(email: string): Promise<ServiceAnswer<string | number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/available/email', { email })
          return response.status
        },
        (error) => {
          if (error.status === 409) {
            return 'El email introducido ya está en uso'
          }
        },
      )
    },

    async checkNif(nif: string): Promise<ServiceAnswer<string | number>> {
      return handleRequest(
        async () => {
          const response = await api.post('/auth/available/nif', { nif })
          return response.status
        },
        (error) => {
          if (error.status === 409) {
            return 'El NIF introducido ya está en uso'
          }
        },
      )
    },

    async setToken(token: string) {
      this.token = token
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
