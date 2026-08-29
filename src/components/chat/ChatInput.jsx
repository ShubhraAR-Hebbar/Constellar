import React, { useRef, useEffect, useCallback } from 'react'
import { Send, Square } from 'lucide-react'

export default function ChatInput({ onSend, isLoading, disabled }) {
  const textareaRef = useRef(null)
  const [value, setValue] = React.useState('')

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isLoading, disabled, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') {
      setValue('')
    }
  }

  return (
    <div
      className="p-4 shrink-0"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(125,216,255,0.15)',
          boxShadow: value ? '0 0 0 1px rgba(125,216,255,0.2)' : 'none',
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Nova... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-[14px] text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed font-sans-ui overflow-hidden"
          style={{ maxHeight: '160px', cursor: 'text' }}
        />

        {/* Send / Stop button */}
        <button
          onClick={handleSend}
          disabled={(!value.trim() && !isLoading) || disabled}
          title={isLoading ? 'Stop' : 'Send message'}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background:
              value.trim() && !isLoading
                ? 'linear-gradient(135deg, #0e6edf, #0ea5e9)'
                : isLoading
                ? 'rgba(239,68,68,0.2)'
                : 'rgba(125,216,255,0.08)',
            border: isLoading
              ? '1px solid rgba(239,68,68,0.3)'
              : '1px solid rgba(125,216,255,0.2)',
            boxShadow:
              value.trim() && !isLoading ? '0 4px 12px rgba(14,110,223,0.3)' : 'none',
          }}
        >
          {isLoading ? (
            <Square size={14} className="text-red-400" />
          ) : (
            <Send size={15} className={value.trim() ? 'text-white' : 'text-slate-500'} />
          )}
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-600 text-center mt-2">
        Nova AI · Powered by Google Gemini 2.5 Flash · Not financial or professional advice
      </p>
    </div>
  )
}