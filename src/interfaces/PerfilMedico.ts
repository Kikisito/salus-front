import type { Especialidad } from './Especialidad'
import type { User } from './User'

export interface PerfilMedico {
  id: number
  user: User
  numeroColegiado: string
  especialidades: Especialidad[]
}
