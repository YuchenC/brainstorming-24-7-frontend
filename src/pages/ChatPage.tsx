import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChatPane } from "../components/layout/ChatPane"
import { ConnectionStatus } from "../components/ui/ConnectionStatus"
import { useWebSocket } from "../hooks/useWebSocket"

export function ChatPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const { isConnected, ws, reconnecting, messages, sendMessage } = useWebSocket({
    url: wsUrl,
    roomId: roomId || null,
    participantId: "human-123" // Should match the ID used in room creation
  })

  useEffect(() => {
    // Retrieve connection info from sessionStorage
    const storedRoomId = sessionStorage.getItem("roomId")
    const storedWsUrl = sessionStorage.getItem("wsUrl")

    // Validate room access
    if (!storedRoomId || storedRoomId !== roomId) {
      navigate("/")
      return
    }

    setWsUrl(storedWsUrl)
  }, [roomId, navigate])

  if (!wsUrl) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <ConnectionStatus isConnected={isConnected} reconnecting={reconnecting} />
        </div>
        <ChatPane 
          ws={ws} 
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  )
} 