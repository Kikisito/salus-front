import type { Specialty } from './Specialty'
import type { User } from './User'

export interface MedicalProfile {
  id: number
  user: User
  license: string
  workEmail: string
  workPhone: string
  specialties: Specialty[]
}
