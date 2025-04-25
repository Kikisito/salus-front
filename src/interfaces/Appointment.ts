import type { AppointmentSlot } from './AppointmentSlot'
import type { Prescription } from './Prescription'
import type { Report } from './Report'
import type { User } from './User'

export interface Appointment {
  id: number
  slot: AppointmentSlot
  patient: User
  type: string
  status: string
  reason: string
  doctorObservations: string
  createdAt: string
  updatedAt: string
  reports: Report[]
  prescriptions: Prescription[]
}
