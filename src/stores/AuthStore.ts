import { AxiosError } from 'axios'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { Cookies, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import {
  createErrorServiceAnswer,
  createSucessServiceAnswer,
  type ServiceAnswer,
} from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

// Configuración de cookies de autenticación
const COOKIE_NAME = 'AUTH-TOKEN'
const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: 'Strict' as const,
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
      try {
        const response = await api.post('/auth/login', {
          nif: username,
          password: password,
        })
        const data = await response.data

        this.token = data.jwt
        Cookies.set(COOKIE_NAME, this.token, COOKIE_OPTIONS)

        return createSucessServiceAnswer(this.token)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === 'ERR_NETWORK') {
            return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
          } else {
            return createErrorServiceAnswer(
              'Los datos introducidos no coinciden con ningún usuario',
            )
          }
        } else {
          console.error(error)
          return createErrorServiceAnswer('Ha ocurrido un error inesperado')
        }
      }
    },

    async register(user: User): Promise<ServiceAnswer<number>> {
      try {
        const response = await api.post('/auth/register', user)

        const data = await response.data
        this.token = data.jwt
        Cookies.set(COOKIE_NAME, this.token, COOKIE_OPTIONS)

        return createSucessServiceAnswer(data)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === 'ERR_NETWORK') {
            return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
          } else {
            console.error(error)
            return createErrorServiceAnswer('Algunos datos introducidos no son válidos')
          }
        } else {
          console.error(error)
          return createErrorServiceAnswer('Ha ocurrido un error inesperado')
        }
      }
    },

    async logout() {
      try {
        const response = await api.post('/auth/logout')
        const result = await response.status

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
    },

    async getCurrentProfile(): Promise<ServiceAnswer<User>> {
      try {
        const response = await api.get('/user/@me')
        const data = await response.data
        this.user = data

        return createSucessServiceAnswer(data)
      } catch (error) {
        console.error(error)
        return createErrorServiceAnswer('Ha ocurrido un error inesperado')
      }
    },

    async requestPasswordReset(email: string, nif: string): Promise<ServiceAnswer<number>> {
      try {
        const response = await api.post('/auth/forgot-password/request', { email: email, nif: nif })

        return createSucessServiceAnswer(response.status)
      } catch (error) {
        console.error(error)
        return createErrorServiceAnswer('Ha ocurrido un error inesperado')
      }
    },

    async resetPassword(token: string, password: string): Promise<ServiceAnswer<number>> {
      try {
        const response = await api.post('/auth/forgot-password/reset', {
          token: token,
          password: password,
        })

        return createSucessServiceAnswer(response.status)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === 'ERR_NETWORK') {
            return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
          } else {
            return createErrorServiceAnswer('El enlace de recuperación de contraseña no es válido')
          }
        } else {
          console.error(error)
          return createErrorServiceAnswer('Ha ocurrido un error inesperado')
        }
      }
    },

    async checkEmail(email: string): Promise<ServiceAnswer<string | number>> {
      try {
        const response = await api.post('/auth/available/email', { email })

        return createSucessServiceAnswer(response.status)
      } catch (error) {
        if (error instanceof AxiosError) {
          // Si no se puede establecer conexión con el servidor
          if (error.code === 'ERR_NETWORK') {
            return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
          } else {
            // Si el email ya está en uso (debería ser el único error posible
            return createErrorServiceAnswer('El correo electrónico introducido ya está en uso')
          }
        }
        // Si ocurre un error inesperado
        console.error(error)
        return createErrorServiceAnswer('Ha ocurrido un error inesperado')
      }
    },

    async checkNif(nif: string): Promise<ServiceAnswer<string | number>> {
      try {
        const response = await api.post('/auth/available/nif', { nif })

        return createSucessServiceAnswer(response.status)
      } catch (error) {
        if (error instanceof AxiosError) {
          // Si no se puede establecer conexión con el servidor
          if (error.code === 'ERR_NETWORK') {
            return createErrorServiceAnswer('No se ha podido establecer conexión con el servidor')
          } else {
            // Si el NIF ya está en uso (debería ser el único error posible)
            return createErrorServiceAnswer('El NIF introducido ya está en uso')
          }
        }
        // Si ocurre un error inesperado
        console.error(error)
        return createErrorServiceAnswer('Ha ocurrido un error inesperado')
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
