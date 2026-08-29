import React from 'react'
import { Sparkles, MessageSquare, Trash2, Plus, LogOut } from 'lucide-react'

export default function Sidebar({
  conversations,
  activeConvId,
  onSelect,
  onDelete,
  onNewChat,
  onBack,
}) {
  return (
    <aside
      className="w-full md:w-[280px] h-full flex flex-col shrink-0 select-none border-b md:border-b-0 md:border-r border-white/[0.08]"
      style={{
        background: 'rgba(8, 13, 35, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(125,216,255,0.15), rgba(179,136,255,0.15))',
              border: '1px solid rgba(125,216,255,0.3)',
            }}
          >
            <Sparkles size={16} className="text-cyan-300" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white leading-none font-sans-ui">Nova Copilot</h3>
            <span className="text-[9px] font-mono text-cyan-400/60 leading-none">Vite + Gemini</span>
          </div>
        </div>

        {/* Back to main portfolio button */}
        <button
          onClick={onBack}
          title="Back to portfolio"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <LogOut size={15} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pb-3 shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white tracking-wide transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(14,110,223,0.15)]"
          style={{
            background: 'linear-gradient(135deg, #0e6edf, #0ea5e9)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none'
          }}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Scrollable Conversation List */}
      <div
        className="flex-1 overflow-y-auto px-2 space-y-1 pb-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(125,216,255,0.15) transparent',
        }}
      >
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-[11px] font-mono text-slate-500">
            No previous chats
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConvId
            return (
              <div
                key={conv.id}
                className="group relative flex items-center rounded-xl transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(125, 216, 255, 0.08)' : 'transparent',
                  border: isActive
                    ? '1px solid rgba(125, 216, 255, 0.2)'
                    : '1px solid transparent',
                }}
              >
                {/* Title Selection Button */}
                <button
                  onClick={() => onSelect(conv.id)}
                  className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] text-slate-300 hover:text-white transition-colors cursor-pointer min-w-0 pr-10"
                >
                  <MessageSquare
                    size={14}
                    className={isActive ? 'text-cyan-300 shrink-0' : 'text-slate-500 shrink-0'}
                  />
                  <span className="truncate block font-sans-ui">{conv.title}</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  title="Delete chat"
                  className="absolute right-2 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 md:opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}