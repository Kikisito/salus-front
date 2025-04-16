import type { MedicalCenter } from './MedicalCenter'

export interface Room {
  id: number
  medicalCenter: MedicalCenter
  name: string
}
