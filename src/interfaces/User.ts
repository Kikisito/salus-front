import type { Direccion } from './Direccion'

export interface User {
  nombre: string
  apellidos: string
  nif: string
  fechaNacimiento: Date
  email: string
  lastPasswordChange: Date
  telefono: string
  sexo: string
  direccion: Direccion
  password: string
  rolesList: string[]
}
