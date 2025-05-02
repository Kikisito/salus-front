import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Room } from 'src/interfaces/Room'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useRoomStore = defineStore('roomStore', {
  state: () => ({
    count: 0,
    rooms: [] as Room[],
  }),

  actions: {
    async getAllRooms(page: number = 0, limit: number = 10): Promise<ServiceAnswer<Room[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/rooms/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.rooms = await response.data.rooms

          return this.rooms
        },
        (error) => {
          throw error
        },
      )
    },

    async searchRooms(
      query: string,
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<Room[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/rooms/search/' + query + '/' + page + '/' + limit)
          this.count = await response.data.count
          this.rooms = await response.data.rooms

          return this.rooms
        },
        (error) => {
          throw error
        },
      )
    },

    async getRoom(id: number): Promise<ServiceAnswer<Room>> {
      return handleRequest(
        async () => {
          const response = await api.get('/rooms/' + id)
          const room = await response.data

          return room
        },
        (error) => {
          throw error
        },
      )
    },

    async addRoom(room: Room): Promise<ServiceAnswer<Room>> {
      return handleRequest(
        async () => {
          const response = await api.post('/rooms/add', room)
          const newRoom = await response.data

          // Añadimos el nuevo centro médico a la lista local
          this.rooms.push(newRoom)

          return newRoom
        },
        (error) => {
          throw error
        },
      )
    },

    async updateRoom(room: Room): Promise<ServiceAnswer<Room>> {
      return handleRequest(
        async () => {
          const response = await api.put('/rooms/' + room.id, room)
          const updatedRoom = await response.data

          // Actualizamos el centro médico en la lista local
          const index = this.rooms.findIndex((r) => r.id === updatedRoom.id)
          if (index !== -1) {
            this.rooms[index] = updatedRoom
          }

          return updatedRoom
        },
        (error) => {
          throw error
        },
      )
    },

    async deleteRoom(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/rooms/' + id)
          const deleted = response.status === 204

          // Eliminamos el centro médico de la lista local
          this.rooms = this.rooms.filter((r) => r.id !== id)

          return deleted
        },
        (error) => {
          throw error
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
}
