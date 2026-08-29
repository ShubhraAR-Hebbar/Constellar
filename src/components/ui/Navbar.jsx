import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ isReducedMotion, setIsReducedMotion, isAudioOn, setIsAudioOn }) {
  return (
    <header
      className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 py-4 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, rgba(5,6,15,0.8) 0%, transparent 100%)' }}
    >
      {/* ── Logo / Initials ── */}
      <button
        className="flex items-center gap-3 pointer-events-auto group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold tracking-widest font-mono transition-all duration-300"
          style={{
            background: 'rgba(125,216,255,0.08)',
            border: '1px solid rgba(125,216,255,0.2)',
            color: '#7dd8ff',
          }}
        >
          SH
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[12px] font-semibold text-slate-200 leading-none font-sans-ui group-hover:text-white transition-colors">
            Shubhra AR Hebbar
          </span>
          <span className="text-[10px] font-mono text-cyan-400/60 leading-none mt-0.5">
            AI/ML · Full-Stack
          </span>
        </div>
      </button>

      {/* ── Controls ── */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Nova Chat Link */}
        <Link
          to="/chat"
          className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-mono tracking-wider transition-all duration-200"
          style={{
            background: 'rgba(125,216,255,0.08)',
            border: '1px solid rgba(125,216,255,0.2)',
            color: '#7dd8ff',
          }}
        >
          <span>💬</span>
          <span className="hidden sm:inline">NOVA CHAT</span>
        </Link>

        {/* Audio toggle */}
        <button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-mono tracking-wider transition-all duration-200"
          style={{
            background: isAudioOn ? 'rgba(125,216,255,0.08)' : 'rgba(255,255,255,0.03)',
            border: isAudioOn ? '1px solid rgba(125,216,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
            color: isAudioOn ? '#7dd8ff' : '#64748b',
          }}
        >
          <span>{isAudioOn ? '◉' : '○'}</span>
          <span className="hidden sm:inline">{isAudioOn ? 'AMBIENT' : 'SILENT'}</span>
        </button>

        {/* 3D / 2D mode */}
        <button
          onClick={() => setIsReducedMotion(!isReducedMotion)}
          className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-mono tracking-wider transition-all duration-200"
          style={{
            background: isReducedMotion ? 'rgba(179,136,255,0.08)' : 'rgba(255,255,255,0.03)',
            border: isReducedMotion ? '1px solid rgba(179,136,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
            color: isReducedMotion ? '#b388ff' : '#64748b',
          }}
        >
          <span>{isReducedMotion ? '▣' : '⬡'}</span>
          <span className="hidden sm:inline">{isReducedMotion ? '2D MODE' : '3D MODE'}</span>
        </button>
      </div>
    </header>
  )
}
