import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/chat/Sidebar'
import ChatArea from '../components/chat/ChatArea'
import { useConversations } from '../hooks/useConversations'

export default function ChatPage() {
  const navigate = useNavigate()
  const {
    conversations,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
  } = useConversations()

  const [activeConvId, setActiveConvId] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize a new conversation if list is empty
  useEffect(() => {
    if (conversations.length === 0) {
      const newId = createConversation()
      if (newId) setActiveConvId(newId)
    } else if (!activeConvId) {
      if (conversations[0]?.id) {
        setActiveConvId(conversations[0].id)
      }
    }
  }, [conversations, activeConvId, createConversation])



  const handleNewChat = () => {
    const newId = createConversation()
    setActiveConvId(newId)
    setIsSidebarOpen(false)
  }

  const handleDeleteChat = (id) => {
    deleteConversation(id)
    if (activeConvId === id) {
      // Pick next available
      const remaining = conversations.filter((c) => c.id !== id)
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id)
      } else {
        setActiveConvId(null)
      }
    }
  }

  return (
    <div
      className="chat-page-root fixed inset-0 w-screen h-screen flex flex-col md:flex-row text-slate-100 bg-[#05060f]"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0c1030 0%, #05060f 70%)',
      }}
    >
      {/* Mobile Header Bar */}
      <header
        className="flex items-center justify-between px-4 py-3 md:hidden border-b border-white/[0.08]"
        style={{ background: 'rgba(8, 13, 35, 0.95)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06] cursor-pointer"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-[14px] font-bold text-white font-sans-ui">Nova AI</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-mono text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Portfolio</span>
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <div
        className={`fixed md:relative top-[57px] md:top-0 bottom-0 left-0 z-50 md:z-auto transition-transform duration-300 md:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex`}
      >
        <Sidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onSelect={(id) => {
            setActiveConvId(id)
            setIsSidebarOpen(false)
          }}
          onDelete={handleDeleteChat}
          onNewChat={handleNewChat}
          onBack={() => navigate('/')}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 h-[calc(100vh-57px)] md:h-screen flex flex-col relative min-w-0">
        <ChatArea
          activeConvId={activeConvId}
          getConversation={getConversation}
          updateConversation={updateConversation}
        />
      </main>
    </div>
  )
}