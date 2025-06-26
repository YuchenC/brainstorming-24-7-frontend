import { Button } from "@/components/ui/button"

export function ChatPane() {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-zinc-100">
      <h1 className="text-2xl font-bold mb-4">Let’s brainstorm 👇</h1>
      <div className="space-y-4">
        {/* Dummy messages */}
        <div className="p-4 bg-white rounded shadow">User: What's a good startup idea?</div>
        <div className="p-4 bg-blue-100 rounded shadow">AI: Try something in mental wellness ✨</div>
      </div>

      {/* Dummy input */}
      <div className="mt-6">
        <input
          type="text"
          className="w-full px-4 py-2 border border-zinc-300 rounded"
          placeholder="Type your idea..."
        />
        <Button className="mt-2">Send</Button>
      </div>
    </div>
  )
}

