import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
      <Button variant="default">Let's brainstorm 💡</Button>
    </div>
  )
}

export default App;

