import { defineStore, acceptHMRUpdate } from 'pinia'
import { Cookies, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

// Configuración de cookies de autenticación
const COOKIE_NAME = 'AUTH-TOKEN'
const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: 'Lax' as const,
  path: '/',
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: Cookies.get(COOKIE_NAME) || (null as string | null),
    user: null as User | null,
  }),

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
          Cookies.set(COOKIE_NAME, this.token, COOKIE_OPTIONS)

          return data.jwt
        },
        (error) => {
          if (error.status === 404) {
            return 'Los datos introducidos no coinciden con ningún usuario'
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
          Cookies.set(COOKIE_NAME, this.token, COOKIE_OPTIONS)

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
          this.token = null
          Cookies.remove(COOKIE_NAME, { path: '/' })
          this.router.push({ name: 'login' })
        }
      })
    },

    async getCurrentProfile(): Promise<ServiceAnswer<User>> {
      return handleRequest(async () => {
        const response = await api.get('/user/@me')
        const data = await response.data
        this.user = data

        return data
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
