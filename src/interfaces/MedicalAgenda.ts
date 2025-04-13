import type { Especialidad } from './Especialidad'
import type { PerfilMedico } from './PerfilMedico'
import type { Room } from './Room'

export interface MedicalAgenda {
  id?: number
  medico: PerfilMedico
  especialidad: Especialidad
  consulta: Room
  diaSemana: number
  horaInicio: string
  horaFin: string
  duracionCita: number
}
