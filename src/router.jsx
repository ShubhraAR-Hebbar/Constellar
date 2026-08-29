import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from './App'
import ChatPage from './pages/ChatPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}