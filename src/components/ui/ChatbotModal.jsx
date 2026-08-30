import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  X,
  Trash2,
  Settings,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Layers,
  ChevronDown,
  Info,
  KeyRound,
} from 'lucide-react'
import {
  BOT_NAME,
  BOT_TITLE,
  QUICK_PROMPTS,
  CATEGORIZED_PROMPTS,
  getOfflineChatbotResponse,
  // callGeminiLLM,
} from '../../data/chatbotKnowledge'
import { sendMessage } from '../../services/chatService'

// ── Cosmic Web Audio Synthesizer ─────────────────────────────────────────────
class CosmicSoundFx {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playSend() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.12)
    } catch (_) {}
  }

  playReceive() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc2.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08) // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.08) // G5
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc2.start(now + 0.06)
      osc.stop(now + 0.25)
      osc2.stop(now + 0.25)
    } catch (_) {}
  }

  playOpen() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.18)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.18)
    } catch (_) {}
  }
}

const sfx = new CosmicSoundFx()

// ── Formatted Message Renderer ───────────────────────────────────────────────
function FormattedText({ content }) {
  // Simple markdown-style parser for bold, inline code, links, lists
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed text-slate-200">
      {lines.map((line, lIdx) => {
        if (!line.trim()) return <div key={lIdx} className="h-1.5" />

        // Bullet point
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
        const lineContent = isBullet ? line.replace(/^[\s•\-\*]+/, '') : line

        // Parse bold, code, and links
        const formatted = parseInline(lineContent)

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1">
              <span className="text-cyan-400 mt-1 text-[10px]">◈</span>
              <div className="flex-1">{formatted}</div>
            </div>
          )
        }

        return <div key={lIdx}>{formatted}</div>
      })}
    </div>
  )
}

function parseInline(text) {
  // Regex to split by markdown links [title](url), bold **text**, inline `code`
  const parts = []
  let remaining = text

  // Quick scanner
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      // Markdown link
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 font-mono text-[12px]"
        >
          {match[2]}
          <ExternalLink size={10} className="inline" />
        </a>
      )
    } else if (match[4]) {
      // Bold text
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {match[4]}
        </strong>
      )
    } else if (match[5]) {
      // Inline code
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 font-mono text-[11px]"
        >
          {match[5]}
        </code>
      )
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export default function ChatbotModal({
  onNavigate,
  isReducedMotion,
  setIsReducedMotion,
  isAudioOn,
  setIsAudioOn,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `👋 **Greetings! I am Nova**, Shubhra's AI Co-Pilot for the Constellar portfolio.\n\nI can answer anything about his **AI/ML pipelines, projects (PlateX, SentiX, EcoTrack)**, full-stack proficiencies, internships, or pilot the 3D camera across the constellation for you.\n\nWhat would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: '🚀 Explore Projects', type: 'navigate', value: 0.57 },
        { label: '🧠 AI/ML Skills', type: 'query', value: 'What are his AI/ML skills?' },
        { label: '💼 Experience', type: 'navigate', value: 0.32 },
        { label: '📬 Contact Info', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['Tell me about PlateX', 'What is SentiX?', 'Where did he study?', 'How to contact?'],
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)
  const [soundEnabled] = useState(true)
  const [ttsEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Projects')
  const [unreadCount, setUnreadCount] = useState(1)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)

  // Env-baked key (from .env VITE_GEMINI_API_KEY) — fallback for all visitors
  const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

  // Gemini API key: user-set key from localStorage takes priority, then env key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('constellar_gemini_key') || ENV_API_KEY)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Sync sound settings
  useEffect(() => {
    sfx.enabled = soundEnabled
  }, [soundEnabled])

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      if (!hasOpenedOnce) {
        setHasOpenedOnce(true)
        setUnreadCount(0)
      }
    }
  }, [messages, isOpen, scrollToBottom, hasOpenedOnce])

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputVal(transcript)
        setIsListening(false)
        handleSend(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  // Text to Speech
  const speakText = useCallback((text) => {
    if (!ttsEnabled || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#`_◈\[\]\(\)]/g, '').replace(/https?:\/\/\S+/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }, [ttsEnabled])

  // Toggle Voice Input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.warn('Speech recognition error:', err)
        setIsListening(false)
      }
    }
  }

  // Handle Send Message
  const handleSend = async (customQuery) => {
    const query = (customQuery || inputVal).trim()
    if (!query || isTyping) return

    setInputVal('')
    sfx.playSend()

    const userMsgId = `u-${Date.now()}`
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      // Always try secure Express backend first
      const botResponse = await sendMessage({
        prompt: query,
        history: messages,
      })

      const botMsgId = `b-${Date.now()}`
      const botMsg = {
        id: botMsgId,
        sender: 'bot',
        text: botResponse.text,
        actions: botResponse.actions || [],
        suggestions: botResponse.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      sfx.playReceive()
      speakText(botResponse.text)
    } catch (err) {
      console.warn('Backend API unavailable, falling back to offline knowledge engine:', err.message)
      
      // Fast instant fallback response
      await new Promise((res) => setTimeout(res, 350))
      const botResponse = getOfflineChatbotResponse(query)

      const botMsgId = `b-${Date.now()}`
      const botMsg = {
        id: botMsgId,
        sender: 'bot',
        text: botResponse.text,
        actions: botResponse.actions || [],
        suggestions: botResponse.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      sfx.playReceive()
      speakText(botResponse.text)
    } finally {
      setIsTyping(false)
    }
  }

  // Handle Action Buttons Clicked
  const handleActionClick = (action) => {
    if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.value)
    } else if (action.type === 'query') {
      handleSend(action.value)
    } else if (action.type === 'copy') {
      navigator.clipboard.writeText(action.value)
      setCopiedKey(action.value)
      setTimeout(() => setCopiedKey(null), 2000)
    } else if (action.type === 'link') {
      window.open(action.url, '_blank', 'noopener,noreferrer')
    } else if (action.type === 'toggle_mode' && setIsReducedMotion) {
      setIsReducedMotion(!isReducedMotion)
    }
  }

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault()
    localStorage.setItem('constellar_gemini_key', apiKey.trim())
    setShowSettings(false)
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'bot',
        text: apiKey.trim()
          ? `✅ **Gemini AI Connected!** Nova is now powered by **Google Gemini 2.0 Flash** — ask me anything about Shubhra's work, projects, or tech stack!`
          : `⚡ **Offline Mode Active!** Nova will use the built-in neural knowledge engine. Add a Gemini API key above to enable live AI responses.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <>
      {/* ── Floating Launcher Orb (Bottom Right) ───────────────────────────── */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none ${isOpen ? 'hidden sm:flex' : 'flex'}`}>
        {/* Welcome Callout Badge (hidden once opened) */}
        {!isOpen && unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => {
              setIsOpen(true)
              sfx.playOpen()
            }}
            data-cursor-hover
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl cursor-pointer"
            style={{
              background: 'rgba(8, 13, 35, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(125, 216, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(125, 216, 255, 0.15)',
            }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-mono text-cyan-200">
              Ask <span className="text-cyan-400 font-semibold font-sans-ui">Nova AI</span> anything
            </span>
          </motion.div>
        )}

        {/* Main Floating Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            const next = !isOpen
            setIsOpen(next)
            if (next) sfx.playOpen()
          }}
          data-cursor-hover
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden focus:outline-none group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 23, 62, 0.95), rgba(7, 10, 28, 0.95))',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(125, 216, 255, 0.35)',
            boxShadow: isOpen
              ? '0 0 30px rgba(125, 216, 255, 0.4), 0 0 10px rgba(179, 136, 255, 0.3)'
              : '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px rgba(125, 216, 255, 0.25)',
          }}
          aria-label="Toggle Nova AI Chatbot"
        >
          {/* Animated pulsing orbital ring */}
          <div
            className="absolute inset-0 rounded-2xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at center, rgba(125, 216, 255, 0.25) 0%, transparent 70%)',
            }}
          />

          {isOpen ? (
            <X size={22} className="text-cyan-300 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles size={24} className="text-cyan-300 animate-pulse" />
              {/* Unread badge dot */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#05060f] shadow-[0_0_8px_#7dd8ff]" />
              )}
            </div>
          )}
        </motion.button>
      </div>

      {/* ── Chatbot Window (Modal/Drawer) ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed z-50 flex flex-col pointer-events-auto select-text font-sans-ui ${
              isExpanded
                ? 'inset-4 sm:inset-10 sm:max-w-4xl sm:mx-auto'
                : 'bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[450px] h-[480px] sm:h-[580px] max-h-[75vh] sm:max-h-[calc(100vh-8rem)]'
            }`}
            style={{
              background: 'rgba(8, 13, 35, 0.94)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: '24px',
              border: '1px solid rgba(125, 216, 255, 0.22)',
              boxShadow:
                '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(125, 216, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Holographic Glowing Header Top Accent Line */}
            <div
              className="h-[2.5px] w-full shrink-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #7dd8ff 35%, #b388ff 70%, transparent 100%)',
              }}
            />

            {/* ── Window Header ── */}
            <header className="px-5 py-3.5 flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(125, 216, 255, 0.15), rgba(179, 136, 255, 0.15))',
                    border: '1px solid rgba(125, 216, 255, 0.3)',
                  }}
                >
                  <Bot size={18} className="text-cyan-300" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-[#05060f]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-white tracking-wide flex items-center gap-1.5">
                      {BOT_NAME}
                      <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {(apiKey || ENV_API_KEY) ? 'GROQ AI' : 'OFFLINE AI'}
                      </span>
                    </h3>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 leading-none mt-0.5">
                    {BOT_TITLE} · Active
                  </p>
                </div>
              </div>

              {/* Header Action Tools */}
              <div className="flex items-center gap-1 text-slate-400">
                {/* LLM Settings */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  data-cursor-hover
                  title="Configure LLM API Key"
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    showSettings ? 'text-cyan-300 bg-cyan-500/15' : 'hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <KeyRound size={15} />
                </button>

                {/* Clear Chat */}
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: `wel-${Date.now()}`,
                        sender: 'bot',
                        text: `🧹 **Chat cleared!** How can I assist you with Shubhra's work?`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        actions: [
                          { label: '🚀 Explore Projects', type: 'navigate', value: 0.57 },
                          { label: '🧠 AI/ML Skills', type: 'query', value: 'What are his AI/ML skills?' },
                          { label: '📬 Contact Info', type: 'navigate', value: 0.93 },
                        ],
                        suggestions: ['Tell me about PlateX', 'What is SentiX?', 'Where did he study?'],
                      },
                    ])
                  }}
                  data-cursor-hover
                  title="Clear conversation"
                  className="p-2 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>

                {/* Expand / Minimize Window */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  data-cursor-hover
                  title={isExpanded ? 'Collapse' : 'Expand window'}
                  className="hidden sm:block p-2 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  data-cursor-hover
                  title="Close chat"
                  className="p-2 rounded-lg hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* ── Gemini API Key Settings Drawer ── */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/30 overflow-hidden shrink-0"
                >
                  <form onSubmit={handleSaveSettings} className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                        <KeyRound size={13} />
                        <span>GOOGLE GEMINI API KEY</span>
                      </div>
                      <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                      >
                        Get free key ↗
                      </a>
                    </div>
                    {ENV_API_KEY && !localStorage.getItem('constellar_gemini_key') && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Gemini AI is active via built-in key. You can override it below.
                      </div>
                    )}

                    {/* API Key input */}
                    <div>
                      <label className="block text-[10px] font-mono text-slate-300 mb-1">
                        Gemini API Key <span className="text-slate-500">(from Google AI Studio — free tier available)</span>
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full text-[12px] bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    {/* Model info badge */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[9px]">gemini-2.5-flash</span>
                      <span>Fast, free, and intelligent — powered by Google DeepMind</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10px] text-slate-400">
                        Saved securely in your browser's <code className="text-cyan-300">localStorage</code>.
                      </p>
                      <div className="flex gap-2">
                        {apiKey && (
                          <button
                            type="button"
                            onClick={() => {
                              setApiKey('')
                              localStorage.removeItem('constellar_gemini_key')
                            }}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                          >
                            Remove Key
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
                        >
                          {apiKey ? 'Save & Activate Gemini' : 'Use Offline AI'}
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Category Quick Navigator Pills ── */}
            <div className="px-4 py-2 border-b border-white/[0.05] bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                <Compass size={11} /> Explore:
              </span>
              {Object.keys(CATEGORIZED_PROMPTS).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  data-cursor-hover
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sub-prompts for current category */}
            <div className="px-4 py-1.5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/[0.03] shrink-0">
              {CATEGORIZED_PROMPTS[selectedCategory]?.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  data-cursor-hover
                  className="text-[11px] text-slate-300 hover:text-cyan-300 bg-white/[0.02] hover:bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-white/[0.05] hover:border-cyan-500/25 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ArrowRight size={10} className="opacity-50" />
                </button>
              ))}
            </div>

            {/* ── Message Thread Body ── */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-200"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(125, 216, 255, 0.2) transparent',
              }}
            >
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`flex items-start gap-2.5 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isBot
                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                            : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-200'
                        }`}
                      >
                        {isBot ? <Bot size={15} /> : <User size={15} />}
                      </div>

                      {/* Bubble Container */}
                      <div className="flex flex-col gap-1.5">
                        <div
                          className={`p-3.5 rounded-2xl ${
                            isBot
                              ? 'bg-slate-900/80 border border-white/[0.08] text-slate-200 rounded-tl-sm'
                              : 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white border border-cyan-400/30 rounded-tr-sm shadow-[0_4px_16px_rgba(125,216,255,0.15)]'
                          }`}
                        >
                          <FormattedText content={msg.text} />
                        </div>

                        {/* Interactive Co-Pilot Actions (Bot only) */}
                        {isBot && msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(act)}
                                data-cursor-hover
                                className="px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer group"
                                style={{
                                  background:
                                    act.type === 'navigate'
                                      ? 'rgba(125, 216, 255, 0.12)'
                                      : act.type === 'copy'
                                      ? 'rgba(179, 136, 255, 0.12)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  border:
                                    act.type === 'navigate'
                                      ? '1px solid rgba(125, 216, 255, 0.3)'
                                      : act.type === 'copy'
                                      ? '1px solid rgba(179, 136, 255, 0.3)'
                                      : '1px solid rgba(255, 255, 255, 0.1)',
                                  color:
                                    act.type === 'navigate'
                                      ? '#7dd8ff'
                                      : act.type === 'copy'
                                      ? '#d8b4fe'
                                      : '#e2e8f0',
                                }}
                              >
                                <span>{act.label}</span>
                                {act.type === 'copy' ? (
                                  copiedKey === act.value ? (
                                    <Check size={11} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={11} className="opacity-70 group-hover:opacity-100" />
                                  )
                                ) : act.type === 'link' ? (
                                  <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
                                ) : (
                                  <ArrowRight size={11} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Suggested Questions */}
                        {isBot && msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Suggestions:</span>
                            {msg.suggestions.map((sug, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => handleSend(sug)}
                                data-cursor-hover
                                className="text-[10px] text-cyan-400/80 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <span>{sug}</span>
                                <span className="opacity-40">·</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <span className="text-[9px] font-mono text-slate-500 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-cyan-400 text-[12px] font-mono pl-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                    <Bot size={13} className="animate-spin" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Nova is synthesizing thoughts</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>.</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <footer className="p-3 bg-slate-950/90 border-t border-white/[0.08] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2 relative"
              >
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  data-cursor-hover
                  title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice...'
                      : 'Ask Nova about skills, projects, or say "Jump to contact"...'
                  }
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-cyan-400/50 rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans-ui"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  data-cursor-hover
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-400 shadow-[0_0_15px_rgba(125,216,255,0.3)] transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
