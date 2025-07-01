export type MessageDeliveryStatus = 'pending' | 'delivered'

export type MessageType = 'human_input' | 'agent_response' | 'agent_summary'

export interface Message {
  messageId: string
  roomId: string
  content: string
  sender: string
  timestamp: string // ISO string format
  status?: MessageDeliveryStatus
  type: MessageType
}

export interface MessageCreateRequest {
  messageId: string
  content: string
  sender: string
  type: MessageType
}

export interface MessageResponse {
  roomId: string
  content: string
  sender: string
  timestamp: string
  type: MessageType
}

// Backend response format
interface ServerMessage {
  room_id: string
  content: string
  sender: string
  timestamp: string
  type: MessageType
  message_id: string
}

// Server acknowledgment format
export interface ServerAckMessage {
  message_id: string
  timestamp: string
}

// Helper function to convert backend snake_case to frontend camelCase
export function convertMessageFromServer(message: ServerMessage): Message {
  return {
    messageId: message.message_id,
    roomId: message.room_id,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
    type: message.type,
    status: 'delivered'
  }
}

// Server request format
interface ServerMessageRequest {
  message_id: string
  room_id: string
  content: string
  sender: string
  type: MessageType
}

// Helper function to format a message for sending to the server
export function formatMessageForServer(roomId: string, message: MessageCreateRequest): ServerMessageRequest {
  return {
    message_id: message.messageId,
    room_id: roomId,
    content: message.content,
    sender: message.sender,
    type: 'human_input'  // Always human_input when sending from frontend
  }
} 