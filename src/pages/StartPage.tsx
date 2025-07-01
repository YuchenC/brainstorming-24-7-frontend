import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { createRoom } from "../lib/api"

export function StartPage() {
  const navigate = useNavigate()

  const handleStart = async () => {
    try {
      const { room_id, ws_url } = await createRoom("human-123")
      console.log("Room created", room_id, ws_url)
      // Store the connection info in sessionStorage
      sessionStorage.setItem("roomId", room_id)
      sessionStorage.setItem("wsUrl", ws_url)
      // Navigate to the chat page
      navigate(`/chat/${room_id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create room")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Brainstorming 24/7</h1>
        <Button 
          onClick={handleStart}
          className="px-6 py-3 text-lg"
        >
          Start Brainstorming
        </Button>
      </div>
    </div>
  )
} 