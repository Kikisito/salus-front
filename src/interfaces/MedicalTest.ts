import type { Attachment } from './Attachment'
import type { MedicalProfile } from './MedicalProfile'
import type { Specialty } from './Specialty'
import type { User } from './User'

export interface MedicalTest {
  id: number
  doctor: MedicalProfile
  patient: User
  specialty: Specialty
  appointmentId: number
  attachments: Attachment[]
  name: string
  description: string
  requestedAt: string
  completedAt: string
  scheduledAt: string
  result: string
  observations: string
  createdAt: string
  updatedAt: string
}
