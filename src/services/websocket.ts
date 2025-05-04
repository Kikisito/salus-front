import { Client } from '@stomp/stompjs'
import type { ChatMessage } from 'src/interfaces/ChatMessage'

export async function connectWebSocket(
  token: string,
  onMessage: (message: ChatMessage) => void,
): Promise<Client> {
  const stompClient = new Client({
    brokerURL: `${process.env.SALUS_API_WS_URL || 'ws://127.0.0.1:8080/ws'}?token=${token}`,
  })

  stompClient.onConnect = (frame) => {
    console.log('Conectado al WebSocket: ' + frame)
    stompClient.subscribe('/user/queue/messages', (data) => {
      const message = JSON.parse(data.body)
      onMessage(message)
    })
  }

  stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error)
  }

  stompClient.onStompError = (frame) => {
    console.error('Error de Stomp', frame.headers['message'])
    console.error('Detalles', frame.body)
  }

  stompClient.onDisconnect = (frame) => {
    console.log('Desconectado del WebSocket: ' + frame)
  }

  stompClient.activate()
  return stompClient
}
