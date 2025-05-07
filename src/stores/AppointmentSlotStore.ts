import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { Specialty } from 'src/interfaces/Specialty'

export const useAppointmentSlotStore = defineStore('appointmentSlotStore', {
  state: () => ({
    slots: [] as AppointmentSlot[],
  }),

  actions: {
    async getDoctorAppointmentSlots(
      doctorId: number,
      date: string,
    ): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.get('/appointment-slots/' + doctorId + '/' + date + '/weekly')
          this.slots = await response.data

          return this.slots
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener los huecos de citas'
        },
      )
    },

    async getDoctorAndSpecialtyAvailableAppointmentSlots(
      medicalCenter: MedicalCenter,
      specialty: Specialty,
      doctor: MedicalProfile,
    ): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(
            `/appointment-slots/medical-center/${medicalCenter.id}/specialty/${specialty.id}/doctor/${doctor.id}/available`,
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

    async getAppointmentSlot(id: number): Promise<ServiceAnswer<AppointmentSlot>> {
      return handleRequest(
        async () => {
          const response = await api.get('/appointment-slots/' + id)
          const slot = await response.data
          return slot
        },
        (error) => {
          console.error(error)
          return 'Ha ocurrido un error al obtener el hueco de cita'
        },
      )
    },

    async addAppointmentSlot(entry: AppointmentSlot): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointment-slots/add', entry)
          const slot = await response.data

          // Añadimos a la lista local
          this.slots.push(slot)

          return slot
        },
        (error) => {
          if (error.status === 409) {
            return 'Este hueco colapsa con otro ya existente. Comprueba que el médico o la consulta están disponibles en la fecha y hora seleccionadas'
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
          const response = await api.delete('/appointment-slots/' + id)
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

    async generateSlotsByScheduleAndDate(
      scheduleId: number,
      date: string,
    ): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointment-slots/generate/schedule', {
            scheduleId: scheduleId,
            date: date,
          })
          const slots = await response.data
          return slots
        },
        (error) => {
          if (error.status === 409) {
            // @ts-expect-error errors is a custom interface
            if (error.response?.data?.errors[0].code === 'conflict.day_mismatch') {
              return 'La fecha seleccionada no es válida. Elige un día de la semana que coincida con el día del turno.'
              // @ts-expect-error errors is a custom interface
            } else if (error.response?.data?.errors[0].code === 'conflict.schedule_conflict') {
              return 'Ya existe uno o varios huecos de cita en esta fecha'
            } else {
              console.error(error)
              return 'Ha ocurrido un error al generar los huecos de citas'
            }
          } else if (
            error.status === 400 &&
            // @ts-expect-error errors is a custom interface
            error.response?.data?.errors[0].code === 'bad_request.invalid_date_or_date_range'
          ) {
            return 'La fecha seleccionada no es válida. Recuerda que la fecha debe ser posterior a la actual.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al generar los huecos de citas'
          }
        },
      )
    },

    async generateSlotsByDoctorAndDateRange(
      doctorId: number,
      startDate: string,
      endDate: string,
    ): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointment-slots/generate/doctor-and-date-range', {
            doctorId: doctorId,
            startDate: startDate,
            endDate: endDate,
          })
          const slots = await response.data
          return slots
        },
        (error) => {
          if (error.status === 409) {
            // @ts-expect-error errors is a custom interface
            if (error.response?.data?.errors[0].code === 'conflict.day_mismatch') {
              return 'La fecha seleccionada no es válida. Elige un día de la semana que coincida con el día del turno.'
              // @ts-expect-error errors is a custom interface
            } else if (error.response?.data?.errors[0].code === 'conflict.schedule_conflict') {
              return 'Ya existe uno o varios huecos de cita en esta fecha'
            } else {
              console.error(error)
              return 'Ha ocurrido un error al generar los huecos de citas'
            }
          } else if (
            error.status === 400 &&
            // @ts-expect-error errors is a custom interface
            error.response?.data?.errors[0].code === 'bad_request.invalid_date_or_date_range'
          ) {
            return 'La fecha seleccionada no es válida. Recuerda que la fecha debe ser posterior a la actual.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al generar los huecos de citas'
          }
        },
      )
    },

    async generateSlotsForAllDoctorsWithDateRange(
      startDate: string,
      endDate: string,
    ): Promise<ServiceAnswer<AppointmentSlot[]>> {
      return handleRequest(
        async () => {
          const response = await api.post('/appointment-slots/generate/date-range', {
            startDate: startDate,
            endDate: endDate,
          })
          const slots = await response.data
          return slots
        },
        (error) => {
          if (error.status === 409) {
            // @ts-expect-error errors is a custom interface
            if (error.response?.data?.errors[0].code === 'conflict.day_mismatch') {
              return 'La fecha seleccionada no es válida. Elige un día de la semana que coincida con el día del turno.'
              // @ts-expect-error errors is a custom interface
            } else if (error.response?.data?.errors[0].code === 'conflict.schedule_conflict') {
              return 'Ya existe uno o varios huecos de cita en esta fecha'
            } else {
              console.error(error)
              return 'Ha ocurrido un error al generar los huecos de citas'
            }
          } else if (
            error.status === 400 &&
            // @ts-expect-error errors is a custom interface
            error.response?.data?.errors[0].code === 'bad_request.invalid_date_or_date_range'
          ) {
            return 'La fecha seleccionada no es válida. Recuerda que la fecha debe ser posterior a la actual.'
          } else {
            console.error(error)
            return 'Ha ocurrido un error al generar los huecos de citas'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppointmentSlotStore, import.meta.hot))
}
