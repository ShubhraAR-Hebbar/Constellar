import React from 'react'
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      {/* Bot avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(125,216,255,0.15), rgba(179,136,255,0.15))',
          border: '1px solid rgba(125,216,255,0.3)',
        }}
      >
        <Bot size={16} className="text-cyan-300" />
      </div>

      {/* Dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-cyan-400"
            style={{
              animation: `typingBounce 1.2s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}