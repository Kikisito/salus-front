import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { MedicalAgenda } from 'src/interfaces/MedicalAgenda'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useScheduleStore = defineStore('scheduleStore', {
  state: () => ({
    schedules: [] as MedicalAgenda[],
  }),

  actions: {
    async getDoctorSchedules(doctorId: number): Promise<ServiceAnswer<MedicalAgenda[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/schedules/' + doctorId)
          this.schedules = await response.data

          return this.schedules
        },
        (error) => {
          throw error
        },
      )
    },

    async addScheduleEntry(entry: MedicalAgenda): Promise<ServiceAnswer<MedicalAgenda[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/schedules/add', entry)
          const schedule = await response.data

          // Añadimos el nuevo centro médico a la lista local
          this.schedules.push(schedule)

          return schedule
        },
        (error) => {
          throw error
        },
      )
    },

    async updateSchedule(schedule: MedicalAgenda): Promise<ServiceAnswer<MedicalAgenda[]>> {
      return handleRequest(
        async () => {
          const response = await api.put('/rooms/' + schedule.id, schedule)
          const updatedSchedule = await response.data

          // Actualizamos el centro médico en la lista local
          const index = this.schedules.findIndex((s) => s.id === updatedSchedule.id)
          if (index !== -1) {
            this.schedules[index] = updatedSchedule
          }

          return updatedSchedule
        },
        (error) => {
          throw error
        },
      )
    },

    async deleteRoom(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/schedules/' + id)
          const deleted = response.status === 204

          // Eliminamos el centro médico de la lista local
          this.schedules = this.schedules.filter((s) => s.id !== id)

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
  import.meta.hot.accept(acceptHMRUpdate(useScheduleStore, import.meta.hot))
}
