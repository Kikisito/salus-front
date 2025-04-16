import type { Specialty } from './Specialty'
import type { MedicalProfile } from './MedicalProfile'
import type { Room } from './Room'

export interface MedicalAgenda {
  id: number
  doctor: MedicalProfile
  specialty: Specialty
  room: Room
  dayOfWeek: number
  startTime: string
  endTime: string
  duration: number
}
