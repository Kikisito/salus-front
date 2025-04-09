import type { MedicalCenter } from './MedicalCenter'

export interface Room {
  id: number
  centroMedico: MedicalCenter
  nombre: string
}
