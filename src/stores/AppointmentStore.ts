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

    async getPatientAppointmentsWithDoctorOrItsSpecialties(
      patientId: number,
      doctorId: number,
    ): Promise<ServiceAnswer<Appointment[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/appointments/patient/${patientId}/doctor/${doctorId}`)
          const appointments = await response.data
          return appointments
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción. Solo puedes ver tus citas asignadas.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al obtener las citas del paciente'
          }
        },
      )
    },

    async setAppointmentStatus(id: number, status: string): Promise<ServiceAnswer<Appointment>> {
      return handleRequest(
        async () => {
          const response = await api.patch('/appointments/' + id + '/status', {
            status: status,
          })

          const appointment = await response.data
          return appointment
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción. Solo puedes actualizar tus citas asignadas.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al actualizar el estado de la cita'
          }
        },
      )
    },

    async setAppointmentDoctorObservations(
      id: number,
      observations: string,
    ): Promise<ServiceAnswer<Appointment>> {
      return handleRequest(
        async () => {
          const response = await api.patch('/appointments/' + id + '/doctor-observations', {
            observations,
          })
          const appointment = await response.data
          return appointment
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción. Solo puedes actualizar tus citas asignadas.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al actualizar las observaciones de la cita'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppointmentStore, import.meta.hot))
}
