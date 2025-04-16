import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useAppointmentSlotStore = defineStore('appointmentSlotStore', {
  state: () => ({
    slots: [] as AppointmentSlot[],
  }),

  actions: {
    async getDoctorAppointmentSlots(doctorId: number): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(
            '/appointment-slots/' + doctorId + '/' + date.formatDate(Date.now(), 'DD-MM-YYYY'),
          )
          this.slots = await response.data

          return this.slots
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener los huecos de citas'
        },
      )
    },

    async addAppointmentSlot(entry: AppointmentSlot): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointment-slot/add', entry)
          const slot = await response.data

          // Añadimos a la lista local
          this.slots.push(slot)

          return slot
        },
        (error) => {
          if (error.status === 409) {
            return 'Este hueco con otro ya existente'
          } else if (error.status === 404) {
            return 'Alguno de los datos introducidos no es correcto. Refresca la página e inténtalo de nuevo'
          }

          console.error(error)
          return 'Ha ocurrido un error al añadir el hueco'
        },
      )
    },

    async deleteAppointmentSlot(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/appointment-slot/' + id)
          const deleted = response.status === 204

          // Eliminamos de la lista local
          this.slots = this.slots.filter((s) => s.id !== id)

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
  import.meta.hot.accept(acceptHMRUpdate(useAppointmentSlotStore, import.meta.hot))
}
