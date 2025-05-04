export interface ChatMessage {
  id: number
  chatId: number
  senderType: 'DOCTOR' | 'PATIENT'
  content: string
  createdAt: string
  read: boolean
}
