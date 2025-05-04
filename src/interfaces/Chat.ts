import type { ChatMessage } from './ChatMessage'
import type { MedicalProfile } from './MedicalProfile'
import type { User } from './User'

export interface Chat {
  id: number
  patient: Partial<User>
  doctor: Partial<MedicalProfile>
  lastMessage: ChatMessage
  unreadMessages: number
  createdAt: string
  updatedAt: string
}
