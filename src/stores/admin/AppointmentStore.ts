import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Appointment } from 'src/interfaces/Appointment'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useAppointmentStore = defineStore('appointmentStore', {
  state: () => ({
    appointments: [] as Appointment[],
  }),

  actions: {
    async getAppointment(id: number): Promise<ServiceAnswer<Appointment>> {
      return handleRequest(
        async () => {
          const response = await api.get('/appointments/' + id)
          const appointment = await response.data
          return appointment
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener los detalles de la cita'
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppointmentStore, import.meta.hot))
}
