import type { Appointment } from './Appointment'
import type { Specialty } from './Specialty'
import type { MedicalProfile } from './MedicalProfile'
import type { Room } from './Room'

export interface AppointmentSlot {
  id: number
  doctor: MedicalProfile
  specialty: Specialty
  room: Room
  date: string
  startTime: string
  endTime: string
  appointment?: Appointment
}
