import type { Appointment } from './Appointment'
import type { Especialidad } from './Especialidad'
import type { PerfilMedico } from './PerfilMedico'
import type { Room } from './Room'

export interface AppointmentSlot {
  id: number
  doctor: PerfilMedico
  specialty: Especialidad
  room: Room
  date: string
  time: string
  appointment?: Appointment
}
