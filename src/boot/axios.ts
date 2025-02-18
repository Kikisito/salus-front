import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from 'src/stores/AuthStore'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.SALUS_API_URL || 'http://127.0.0.1:8080/api/v1' })

// Interceptor para añadir el token de auth a las peticiones
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para actualizar el token de auth en el store
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['authorization']
    if (newToken) {
      const authStore = useAuthStore()
      authStore.setToken(newToken.replace('Bearer ', ''))
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
