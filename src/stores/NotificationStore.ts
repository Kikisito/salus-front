import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalNotifications } from '@capacitor/local-notifications'
import type { Prescription } from 'src/interfaces/Prescription'
import type { Medication } from 'src/interfaces/Medication'
import type { PendingLocalNotificationSchema } from '@capacitor/local-notifications'
import type { Appointment } from 'src/interfaces/Appointment'

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    pendingNotifications: [] as PendingLocalNotificationSchema[],
    permissionGranted: false,
  }),

  actions: {
    async checkNotifications(): Promise<void> {
      const { display } = await LocalNotifications.checkPermissions()
      this.permissionGranted = display === 'granted'

      if (!this.permissionGranted) {
        const { display } = await LocalNotifications.requestPermissions()
        this.permissionGranted = display === 'granted'
      }

      await LocalNotifications.getPending().then((result) => {
        this.pendingNotifications = result.notifications
      })
    },

    // Recordatorios de medicación
    async schedulePrescriptionNotification(
      prescription: Prescription,
      startDate: Date,
    ): Promise<boolean> {
      // Comprobamos si el sistema de notificaciones está habilitado
      await this.checkNotifications()

      if (this.permissionGranted) {
        // Por cada medicamento de la receta
        for (const medication of prescription.medications) {
          // ID con formato XXYYYYYYZZZZZZ
          // XX: tipo de notificación (01 para medicamentos/recetas)
          // YYYYYY: ID del medicamento (6 dígitos)
          const medicationIdStr = medication.id.toString().padStart(6, '0').slice(0, 6)
          const notificationId = Number(`01${medicationIdStr}`)

          const times = this.calculateNotificationTimes(medication, startDate)

          // Y por cada hora calculada, programamos la notificación
          for (const time of times) {
            await LocalNotifications.schedule({
              notifications: [
                {
                  id: Number(
                    `${notificationId}${times.indexOf(time).toString().padStart(3, '0').slice(0, 3)}`,
                  ),
                  title: `Es hora de tomar ${medication.name}`,
                  body: `Toma ya tu dosis de ${medication.dosage}${medication.instructions ? ' - ' + medication.instructions : ''}`,
                  schedule: {
                    at: time,
                    allowWhileIdle: true,
                  },
                  extra: {
                    type: 'medication',
                    prescriptionId: prescription.id,
                    medicationId: medication.id,
                  },
                },
              ],
            })
          }
        }

        // Actualizamos el estado de las notificaciones pendientes
        this.checkNotifications()

        return true // Notificaciones programadas correctamente
      }
      return false // No se pudieron programar las notificaciones
    },

    async cancelPrescriptionNotifications(prescription: Prescription): Promise<boolean> {
      try {
        // Comprobamos si el sistema de notificaciones está habilitado
        await this.checkNotifications()

        // Obtenemos todas las notificaciones pendientes
        const { notifications } = await LocalNotifications.getPending()

        // Filtramos las notificaciones que pertenecen a la receta
        const notificationsToCancel = notifications.filter((notification) => {
          const { prescriptionId } = notification.extra
          return prescriptionId === prescription.id
        })

        // Cancelamos las notificaciones filtradas
        await LocalNotifications.cancel({
          notifications: notificationsToCancel.map((notification) => ({
            id: notification.id,
          })),
        })

        // Actualizamos el estado de las notificaciones pendientes
        await this.checkNotifications()

        return true // Notificaciones canceladas correctamente
      } catch (error) {
        console.error('Error al cancelar las notificaciones de la receta:', error)
        return false // Error al cancelar las notificaciones
      }
    },

    async doesPrescriptionHaveNotifications(prescription: Prescription): Promise<boolean> {
      try {
        // Comprobamos si el sistema de notificaciones está habilitado
        await this.checkNotifications()

        // Obtenemos todas las notificaciones pendientes
        const { notifications } = await LocalNotifications.getPending()

        // Comprobamos si alguna de las notificaciones tiene el ID de la receta
        const enabled = notifications.some((notification) => {
          const { prescriptionId } = notification.extra
          return prescriptionId === prescription.id
        })

        return enabled
      } catch (error) {
        console.error('Error al comprobar si una receta tiene notificaciones', error)
        return false
      }
    },

    async cancelAllNotifications(): Promise<void> {
      try {
        // Comprobamos si el sistema de notificaciones está habilitado
        await this.checkNotifications()

        // Primero obtenemos todas las notificaciones pendientes y luego cancelamos una a una (podría existir un cancelar todos, eh capacitor)
        await LocalNotifications.getPending().then((result) => {
          LocalNotifications.cancel({
            notifications: result.notifications.map((notification) => ({
              id: notification.id,
            })),
          })
        })

        // Actualizamos el estado de las notificaciones pendientes
        await this.checkNotifications()
      } catch (error) {
        console.error('Error al cancelar todas las notificaciones:', error)
      }
    },

    calculateNotificationTimes(medication: Medication, startDate: Date): Date[] {
      const times: Date[] = []

      // Obtenemos la fecha de inicio y fin del medicamento
      const medStartDate = new Date(medication.startDate)
      const medEndDate = new Date(medication.endDate)

      // Usamos la fecha de inicio del usuario si es posterior a la del medicamento
      const effectiveStart = startDate > medStartDate ? startDate : medStartDate

      // Registramos las fechas de notificación
      let currentDate = new Date(effectiveStart)
      currentDate.setSeconds(currentDate.getSeconds() + 1)

      while (currentDate <= medEndDate) {
        times.push(new Date(currentDate))
        currentDate = new Date(currentDate.getTime() + medication.frequency * 60 * 60 * 1000)
      }

      return times
    },

    // Recordatorios de citas
    async scheduleAppointmentNotification(appointment: Appointment): Promise<boolean> {
      // Comprobamos si el sistema de notificaciones está habilitado
      await this.checkNotifications()

      try {
        // ID con formato XXYYYYYY
        // XX: tipo de notificación (02 para citas)
        // YYYYYY: ID de la cita (6 dígitos)
        const appointmentId = appointment.id.toString().padStart(6, '0').slice(0, 6)
        const notificationId = Number(`02${appointmentId}`)

        const appointmentDate = new Date(appointment.slot.date)
        const [hours, minutes] = appointment.slot.startTime.split(':').map(Number)
        appointmentDate.setHours(hours!, minutes, 0, 0)

        // Creamos las fechas de las notificaciones y las notificaciones
        // Notificación 1: Un día antes
        const oneDayBefore = new Date(appointmentDate)
        oneDayBefore.setDate(oneDayBefore.getDate() - 1)
        oneDayBefore.setHours(10, 0, 0, 0)

        // Notificación 2: El mismo día por la mañana
        const sameDayMorning = new Date(appointmentDate)
        sameDayMorning.setHours(9, 0, 0, 0)

        // Notificación 3: Una hora antes
        const oneHourBefore = new Date(appointmentDate)
        oneHourBefore.setHours(oneHourBefore.getHours() - 1)

        const notifications = [
          {
            time: oneDayBefore,
            id: notificationId + 1,
            message: `Recuerda que mañana tienes cita médica`,
          },
          {
            time: sameDayMorning,
            id: notificationId + 2,
            message: `Hoy tienes cita médica`,
          },
          {
            time: oneHourBefore,
            id: notificationId + 3,
            message: 'Tu cita médica es dentro de una hora',
          },
        ]

        // Programamos cada notificación
        for (const notification of notifications) {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: notification.id,
                title: `Cita con ${appointment.slot.doctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.'} ${appointment.slot.doctor.user.nombre} ${appointment.slot.doctor.user.apellidos}`,
                body: `${notification.message} en ${appointment.slot.room.medicalCenter.name} a las ${appointment.slot.startTime.substring(0, 5)}`,
                schedule: {
                  at: notification.time,
                },
                extra: {
                  type: 'appointment',
                  appointmentId: appointment.id,
                },
              },
            ],
          })
        }

        // Actualizamos el estado de las notificaciones pendientes
        await this.checkNotifications()

        return true
      } catch (error) {
        console.error('Error al programar las notificaciones de la cita:', error)
        return false
      }
    },

    async cancelAppointmentNotifications(appointment: Appointment): Promise<boolean> {
      try {
        // Comprobamos si el sistema de notificaciones está habilitado
        await this.checkNotifications()

        // Obtenemos todas las notificaciones pendientes
        const { notifications } = await LocalNotifications.getPending()

        // Filtramos las notificaciones que pertenecen a la cita
        const notificationsToCancel = notifications.filter((notification) => {
          const { appointmentId } = notification.extra
          return appointmentId === appointment.id
        })

        // Cancelamos las notificaciones filtradas
        if (notificationsToCancel.length > 0) {
          await LocalNotifications.cancel({
            notifications: notificationsToCancel.map((notification) => ({
              id: notification.id,
            })),
          })
        }

        // Actualizamos el estado de las notificaciones pendientes
        await this.checkNotifications()

        return true // Notificaciones canceladas correctamente
      } catch (error) {
        console.error('Error al cancelar las notificaciones de la cita:', error)
        return false // Error al cancelar las notificaciones
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
