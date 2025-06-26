export function Sidebar() {
  return (
    <div className="w-64 bg-zinc-800 text-white p-4 border-r border-zinc-700">
      <h2 className="text-xl font-semibold mb-4">Brainstorm Guru 🧠</h2>
      <nav className="space-y-2">
        <button className="block text-left w-full hover:bg-zinc-700 px-2 py-1 rounded">🧭 Home</button>
        <button className="block text-left w-full hover:bg-zinc-700 px-2 py-1 rounded">📝 New Session</button>
        <button className="block text-left w-full hover:bg-zinc-700 px-2 py-1 rounded">📁 History</button>
      </nav>
    </div>
  )
}

  