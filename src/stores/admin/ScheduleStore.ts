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
          console.error(error)
          return 'Ha ocurrido un error al obtener la agenda'
        },
      )
    },

    async addScheduleEntry(entry: MedicalAgenda): Promise<ServiceAnswer<MedicalAgenda[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/schedules/add', entry)
          const schedule = await response.data

          // Añadimos a la lista local
          this.schedules.push(schedule)

          return schedule
        },
        (error) => {
          if (error.status === 409) {
            return 'Este horario colapsa con otro ya existente'
          } else if (error.status === 404) {
            return 'Alguno de los datos introducidos no es correcto. Refresca la página e inténtalo de nuevo'
          }

          console.error(error)
          return 'Ha ocurrido un error al añadir la entrada'
        },
      )
    },

    async updateScheduleEntry(entry: MedicalAgenda): Promise<ServiceAnswer<MedicalAgenda[]>> {
      return handleRequest(
        async () => {
          const response = await api.put('/schedules/' + entry.id, entry)
          const updatedSchedule = await response.data

          // Actualizamos en la lista local
          const index = this.schedules.findIndex((s) => s.id === updatedSchedule.id)
          if (index !== -1) {
            this.schedules[index] = updatedSchedule
          }

          return updatedSchedule
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al actualizar la entrada'
        },
      )
    },

    async deleteRoom(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/schedules/' + id)
          const deleted = response.status === 204

          // Eliminamos de la lista local
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
