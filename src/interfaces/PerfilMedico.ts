import type { Especialidad } from './Especialidad'
import type { User } from './User'

export interface PerfilMedico {
  user: User
  numeroColegiado: string
  especialidades: Especialidad[]
}
