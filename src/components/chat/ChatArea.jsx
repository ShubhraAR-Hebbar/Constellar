import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import { useChat } from '../../hooks/useChat'

const STARTER_PROMPTS = [
  { icon: '🚀', label: 'Show me his projects', prompt: 'Tell me about the featured projects in this portfolio' },
  { icon: '🧠', label: 'AI/ML skills', prompt: 'What are his AI and machine learning skills?' },
  { icon: '💼', label: 'Work experience', prompt: 'Tell me about his work experience and internships' },
  { icon: '📬', label: 'How to contact', prompt: 'How can I contact or hire Shubhra?' },
  { icon: '✍️', label: 'Write Python code', prompt: 'Write a Python function to sort a list of dictionaries by a key' },
  { icon: '🌐', label: 'Explain React hooks', prompt: 'Explain React hooks with simple examples' },
]

export default function ChatArea({ activeConvId, getConversation, updateConversation }) {
  const bottomRef = useRef(null)
  const { messages, isLoading, error, sendMessage, regenerate } = useChat({
    activeConvId,
    getConversation,
    updateConversation,
  })

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Message thread */}
      <div
        className="flex-1 overflow-y-auto py-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(125,216,255,0.15) transparent' }}
      >
        {/* Empty state */}
        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(125,216,255,0.15), rgba(179,136,255,0.15))',
                  border: '1px solid rgba(125,216,255,0.3)',
                  boxShadow: '0 0 40px rgba(125,216,255,0.1)',
                }}
              >
                <Sparkles size={30} className="text-cyan-300" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white font-sans-ui">Nova AI</h2>
                <p className="text-sm text-slate-400 mt-1 font-mono">Powered by Gemini 2.5 Flash · Ask me anything</p>
              </div>
            </div>

            {/* Starter prompts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.prompt)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group cursor-pointer"
                  style={{
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(125,216,255,0.25)'
                    e.currentTarget.style.background = 'rgba(125,216,255,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
                    e.currentTarget.style.background = 'rgba(15,23,42,0.6)'
                  }}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-[13px] text-slate-300 group-hover:text-white transition-colors font-sans-ui">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Regenerate button — show after last AI message */}
        {!isLoading && messages.length > 1 && messages[messages.length - 1]?.role === 'model' && (
          <div className="flex justify-center mt-3 mb-2">
            <button
              onClick={regenerate}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <RefreshCw size={13} />
              Regenerate response
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={!activeConvId} />
    </div>
  )
}