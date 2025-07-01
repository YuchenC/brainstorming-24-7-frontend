import { useState, useRef, useEffect } from "react"
import { Message, MessageType } from "../../types/message"
import { Button } from "../ui/Button"
import { Send, Loader2 } from "lucide-react"

interface ChatPaneProps {
  ws: WebSocket | null
  messages: Message[]
  onSendMessage: (content: string) => boolean
}

export function ChatPane({ ws, messages, onSendMessage }: ChatPaneProps) {
  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
      case 'agent_response':
        return 'bg-white rounded-bl-none shadow-md'
      case 'agent_summary':
        return 'bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-bl-none shadow-md'
      default:
        return 'bg-white rounded-bl-none shadow-md'
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
          Let's brainstorm together 🚀
        </h1>
        
        {/* Connection Status */}
        <div className="mt-2">
          {ws ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Connected
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Disconnected
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.messageId}
              className={`flex ${message.type === 'human_input' ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${getMessageStyle(message.type)}`}
              >
                <div className="flex items-center gap-2 mb-1 text-sm">
                  <span className={`font-medium ${message.type === 'human_input' ? 'text-white/90' : 'text-gray-600'}`}>
                    {message.sender}
                  </span>
                  {message.type === 'agent_summary' && (
                    <span className="text-xs bg-emerald-200 px-2 py-0.5 rounded-full font-medium text-emerald-800">
                      Summary
                    </span>
                  )}
                </div>
                <div className={`${message.type === 'human_input' ? 'text-white' : 'text-gray-700'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 pr-12 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                placeholder="Type your idea... (Press Enter to send)"
                disabled={!ws || isSending || ws.readyState !== WebSocket.OPEN}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              {isSending && (
                <div className="absolute right-3 bottom-3 text-blue-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
            <Button 
              onClick={handleSend}
              disabled={!ws || !inputValue.trim() || isSending || ws.readyState !== WebSocket.OPEN}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

