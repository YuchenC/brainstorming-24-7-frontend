import { useState, useEffect, useCallback } from 'react'
import { Message, MessageCreateRequest, convertMessageFromServer } from '../types/message'

interface UseWebSocketProps {
  url: string | null
  roomId: string | null
  participantId: string
}

export function useWebSocket({ url, roomId, participantId }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [reconnectCount, setReconnectCount] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])

  // Expose a send message function
  const sendMessage = useCallback((content: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !roomId) {
      console.warn('Cannot send message - WebSocket is not connected')
      return false
    }

    try {
      // Generate a message ID
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`

      // Create frontend message format
      const message: Message = {
        messageId,
        roomId: roomId,
        content: content.trim(),
        sender: participantId,
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'human_input'
      }

      // Add message to local state immediately
      setMessages(prev => [...prev, message])

      // Convert to backend format and send
      const messageRequest: MessageCreateRequest = {
        messageId,
        content: message.content,
        sender: message.sender,
        type: 'human_input'
      }

      ws.send(JSON.stringify({
        type: "message",
        payload: messageRequest
      }))
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }, [ws, participantId, roomId])

  useEffect(() => {
    let websocket: WebSocket | null = null
    let reconnectTimeout: number | null = null

    const connect = () => {
      if (!url || !roomId) {
        console.log('Cannot connect - missing url or roomId:', { url, roomId })
        return
      }

      console.log('Creating WebSocket connection...', { 
        url, 
        roomId, 
        participantId,
        reconnectAttempt: reconnectCount + 1 
      })
      
      websocket = new WebSocket(url)

      websocket.onopen = () => {
        console.log('WebSocket connection opened, sending handshake...')
        
        // Send handshake immediately on open
        try {
          websocket?.send(JSON.stringify({
            type: "connect",
            payload: {
              room_id: roomId,
              participant_id: participantId
            }
          }))
        } catch (error) {
          console.error('Failed to send handshake:', error)
          websocket?.close()
        }
      }

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Received message:', data)
          
          switch (data.type) {
            case "connect_ack":
              console.log('Connection verified by server')
              setIsConnected(true)
              setWs(websocket)
              setReconnectCount(0) // Reset reconnect count on successful connection
              break
              
            case "ack": {
              // Mark the message with matching ID as delivered
              const { message_id, timestamp } = data
              setMessages(prev => prev.map(msg => 
                msg.messageId === message_id
                  ? { ...msg, status: 'delivered', timestamp }
                  : msg
              ))
              break
            }
              
            case "message": {
              // Only add messages from other participants
              const serverMessage = convertMessageFromServer(data.payload)
              if (serverMessage.sender !== participantId) {
                setMessages(prev => [...prev, serverMessage])
              }
              break
            }
              
            default:
              console.warn('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Failed to parse message:', error)
        }
      }

      websocket.onclose = (event) => {
        console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          reconnectCount
        })
        
        setIsConnected(false)
        setWs(null)

        // Attempt to reconnect with exponential backoff
        if (reconnectCount < 5) {
          // Use a shorter initial delay (500ms) but longer max delay
          const timeout = Math.min(500 * Math.pow(2, reconnectCount), 30000)
          console.log(`Scheduling reconnect attempt ${reconnectCount + 1} in ${timeout}ms...`)
          
          reconnectTimeout = window.setTimeout(() => {
            setReconnectCount(prev => prev + 1)
            connect()
          }, timeout)
        } else {
          console.log('Max reconnection attempts reached')
        }
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    }

    // Initial connection
    connect()

    // Cleanup function
    return () => {
      console.log('Cleaning up WebSocket connection')
      
      if (reconnectTimeout) {
        window.clearTimeout(reconnectTimeout)
      }
      
      if (websocket) {
        websocket.close()
      }
    }
  }, [url, roomId, participantId, reconnectCount])

  return { 
    isConnected, 
    ws,
    reconnecting: reconnectCount > 0,
    messages,
    sendMessage
  }
} 