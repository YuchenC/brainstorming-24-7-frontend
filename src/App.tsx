import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { StartPage } from "./pages/StartPage"
import { ChatPage } from "./pages/ChatPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App


