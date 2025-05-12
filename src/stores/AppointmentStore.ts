import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Appointment } from 'src/interfaces/Appointment'
import type { AppointmentRequest } from 'src/interfaces/AppointmentRequest'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import { useNotificationStore } from './NotificationStore'

export const useAppointmentStore = defineStore('appointmentStore', {
  state: () => ({
    appointments: [] as Appointment[],
  }),

  persist: {
    storage: localStorage,
    pick: ['appointments'],
  },

  actions: {
    async createAppointment(
      appointmentRequest: AppointmentRequest,
      registerReminder: boolean = false,
    ): Promise<ServiceAnswer<Appointment>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointments/new', appointmentRequest)
          const appointment = await response.data

          // Añadimos la cita a la lista local de citas
          this.appointments.push(appointment)

          // Y añadimos un recordatorio en el dispositivo si se da la condición
          if (registerReminder) {
            const notificationStore = useNotificationStore()
            await notificationStore.scheduleAppointmentNotification(appointment)
          }

          return appointment
        },
        (error) => {
          if (
            error.status === 409 &&
            // @ts-expect-error errors is a custom interface
            error.response?.data?.errors[0].code ===
              'conflict.appointment_slot_cannot_be_booked_by_doctor'
          ) {
            return 'No puedes crear una cita en la que el doctor y el paciente sean la misma persona'
          } else if (error.status === 401) {
            return 'No se ha podido crear la cita. Por favor, contacta con el centro médico para gestionar tus citas.'
          } else {
            return 'Ha ocurrido un error al crear la cita'
          }
        },
      )
    },

    async getAppointments(): Promise<ServiceAnswer<Appointment[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/appointments/@me')
          const appointments = await response.data
          this.appointments = appointments
          return appointments
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener las citas'
        },
      )
    },

    async getPastAppointments(): Promise<ServiceAnswer<Appointment[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/appointments/@me/past')
          const appointments = await response.data
          return appointments
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener las citas'
        },
      )
    },

    async deleteAppointment(appointment: Appointment): Promise<ServiceAnswer<Appointment>> {
      return handleRequest(
        async () => {
          const response = await api.delete(`/appointments/${appointment.id}`)
          const appointmentDeleted = await response.data

          // Eliminamos la cita de la lista local de citas
          this.appointments = this.appointments.filter((a) => a.id !== appointment.id)

          // Y eliminamos el recordatorio del dispositivo
          const notificationStore = useNotificationStore()
          await notificationStore.cancelAppointmentNotifications(appointment)

          return appointmentDeleted
        },
        (error) => {
          if (error.status === 401) {
            return 'No tienes permisos para realizar esta acción. Es posible que queden menos de 24 horas para la cita.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al eliminar la cita'
          }
        },
      )
    },

    // Apartados profesional y administración
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
