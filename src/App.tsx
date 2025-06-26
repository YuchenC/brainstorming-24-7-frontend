import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { ChatPane } from "@/components/layout/ChatPane"
import { createRoom } from "@/lib/api"

function App() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [wsUrl, setWsUrl] = useState<string | null>(null)

  const handleStart = async () => {
    try {
      const { room_id, ws_url } = await createRoom("human-123")
      setRoomId(room_id)
      setWsUrl(ws_url)
      console.log("Room created:", room_id, ws_url)
    } catch (err) {
      console.error(err)
      alert("Failed to create room")
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatPane />
        <div className="p-4 border-t bg-white">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={handleStart}
          >
            Start Brainstorm
          </button>
          {roomId && (
            <div className="mt-2 text-sm text-zinc-600">
              Room ID: {roomId}<br />
              WS: {wsUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App


