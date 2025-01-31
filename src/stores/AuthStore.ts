import { AxiosError } from 'axios'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { Cookies } from 'quasar'
import { api } from 'src/boot/axios'

// Configuración de cookies de autenticación
const COOKIE_NAME = 'auth-token'
const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: 'Strict' as const,
  path: '/',
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: Cookies.get(COOKIE_NAME) || (null as string | null),
    loading: false as boolean,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('http://127.0.0.1:8080/api/v1/auth/login', {
          email: username,
          password: password,
        })
        const data = await response.data

        this.token = data.jwt
        Cookies.set(COOKIE_NAME, this.token, COOKIE_OPTIONS)

        this.router.push({ name: 'home' })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === 'ERR_NETWORK') {
            this.error = 'No se ha podido establecer conexión con el servidor'
          } else {
            this.error = 'Los datos introducidos no coinciden con ningún usuario'
          }
        } else {
          this.error = 'Ha ocurrido un error inesperado'
          console.error(error)
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.token = null
      Cookies.remove(COOKIE_NAME, { path: '/' })
      this.router.push({ name: 'login' })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
