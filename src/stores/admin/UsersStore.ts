import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

export const useUsersStore = defineStore('usersStore', {
  state: () => ({
    count: 0,
    users: [] as User[],
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
