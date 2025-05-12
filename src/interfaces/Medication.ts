import type { Prescription } from './Prescription'

export interface Medication {
  id: number
  name: string
  dosage: string
  frequency: number
  startDate: string
  endDate: string
  instructions: string
  prescription: Prescription
}
