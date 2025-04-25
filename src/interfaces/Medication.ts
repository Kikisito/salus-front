import type { Prescription } from './Prescription'

export interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  instructions: string
  prescription: Prescription
}
