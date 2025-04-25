import type { Appointment } from './Appointment'
import type { MedicalProfile } from './MedicalProfile'
import type { Medication } from './Medication'
import type { Specialty } from './Specialty'
import type { User } from './User'

export interface Prescription {
  id: number
  doctor: MedicalProfile
  patient: User
  specialty: Specialty
  appointment: Appointment
  medications: Medication[]
  createdAt: string
  updatedAt: string
}
