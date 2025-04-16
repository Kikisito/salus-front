import type { AppointmentSlot } from './AppointmentSlot'
import type { User } from './User'

export interface Appointment {
  id: number
  appointmentSlot: AppointmentSlot
  patient: User
  type: string
  status: string
  reason: string
}
