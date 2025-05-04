import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { Chat } from 'src/interfaces/Chat'
import type { ChatMessage } from 'src/interfaces/ChatMessage'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'
import type { User } from 'src/interfaces/User'

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    chats: [] as Chat[],
  }),

  actions: {
    async getPatientChats(patient: User): Promise<ServiceAnswer<Chat[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/chats/patient/${patient.id}`)
          this.chats = await response.data
          return this.chats
        },
        (error) => {
          throw error
        },
      )
    },

    async getDoctorChats(doctor: MedicalProfile): Promise<ServiceAnswer<Chat[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/chats/doctor/${doctor.id}`)
          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async getChatInfo(patientId: number, doctorId: number): Promise<ServiceAnswer<Chat>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/chats/doctor/${doctorId}/patient/${patientId}/info`)
          const chat = await response.data
          this.chats = this.chats.map((c) => (c.id === chat.id ? chat : c))
          return chat
        },
        (error) => {
          throw error
        },
      )
    },

    async getChatMessages(
      patientId: number,
      doctorId: number,
    ): Promise<ServiceAnswer<ChatMessage[]>> {
      return handleRequest(
        async () => {
          const response = await api.get(`/chats/doctor/${doctorId}/patient/${patientId}`)
          const messages = await response.data
          return messages
        },
        (error) => {
          throw error
        },
      )
    },

    async sendMessage(
      patientId: number,
      doctorId: number,
      message: string,
    ): Promise<ServiceAnswer<ChatMessage>> {
      return handleRequest(
        async () => {
          const response = await api.post(`/chats/doctor/${doctorId}/patient/${patientId}`, {
            recipientId: 1,
            message: message,
          })
          const chatMessage = await response.data
          this.chats = this.chats.map((c) =>
            c.id === chatMessage.chatId ? { ...c, lastMessage: chatMessage } : c,
          )
          return chatMessage
        },
        (error) => {
          throw error
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
