import { useState } from "react"
import { Message, MessageType } from "../../types/message"
import { Button } from "../ui/Button"

interface ChatPaneProps {
  ws: WebSocket | null
  messages: Message[]
  onSendMessage: (content: string) => boolean
}

export function ChatPane({ ws, messages, onSendMessage }: ChatPaneProps) {
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!ws || !inputValue.trim() || isSending || ws.readyState !== WebSocket.OPEN) return

    setIsSending(true)
    try {
      const success = onSendMessage(inputValue.trim())
      if (success) {
        setInputValue("")
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageStyle = (type: MessageType) => {
    switch (type) {
      case 'human_input':
        return 'bg-white rounded-bl-none'
      case 'agent_response':
        return 'bg-blue-100 rounded-br-none'
      case 'agent_summary':
        return 'bg-green-100 rounded-br-none'
      default:
        return 'bg-white rounded-bl-none'
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto bg-zinc-100">
        <h1 className="text-2xl font-bold mb-4">Let's brainstorm 👇</h1>
        
        {/* Connection Status */}
        <div className="mb-4 p-4 rounded shadow bg-white">
          <div className="font-medium mb-1">WebSocket Status:</div>
          <div>
            {ws ? (
              <span className="text-green-600">Connected (State: {ws.readyState})</span>
            ) : (
              <span className="text-red-600">Disconnected</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.messageId}
              className={`flex ${message.type === 'human_input' ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`p-3 rounded shadow max-w-[80%] ${getMessageStyle(message.type)}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.sender}</span>
                  {message.type === 'agent_summary' && (
                    <span className="text-xs bg-green-200 px-2 py-0.5 rounded">Summary</span>
                  )}
                  <span className="text-gray-600">•</span>
                </div>
                <div className="mt-1">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 border border-zinc-300 rounded"
            placeholder="Type your idea..."
            disabled={!ws || isSending || ws.readyState !== WebSocket.OPEN}
          />
          <Button 
            onClick={handleSend}
            disabled={!ws || !inputValue.trim() || isSending || ws.readyState !== WebSocket.OPEN}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}

