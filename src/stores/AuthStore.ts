import { AxiosError } from 'axios'
import { defineStore, acceptHMRUpdate } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null as string | null,
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

        this.router.push({ name: 'home' })
      } catch (error) {
        if (error instanceof AxiosError) {
          if(error.code === 'ERR_NETWORK') {
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
  },

  persist: {
    /* Encriptar esto podría ser interesante */
    key: 'auth-store',
    storage: localStorage,
    pick: ['token'],
  } as PersistenceOptions,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
