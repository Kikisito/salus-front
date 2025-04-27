import type { MedicalProfile } from './MedicalProfile'
import type { Specialty } from './Specialty'
import type { User } from './User'

export interface Report {
  id: number
  type: string
  specialty: Specialty
  appointmentId: number
  doctor: MedicalProfile
  patient: User
  description: string
  diagnosis: string
  treatment: string
  observations: string
  createdAt: string
  updatedAt: string
}
