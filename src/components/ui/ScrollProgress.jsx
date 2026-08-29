import React from 'react'

const sections = [
  { label: 'HERO', p: 0.0 },
  { label: 'ABOUT', p: 0.18 },
  { label: 'EXPERIENCE', p: 0.32 },
  { label: 'PROJECTS', p: 0.57 },
  { label: 'LEADERSHIP', p: 0.82 },
  { label: 'CONTACT', p: 0.93 },
]

export default function ScrollProgress({ scrollProgress = 0, onDotClick }) {
  const active = sections.reduce((acc, s, i) => (scrollProgress >= s.p - 0.06 ? i : acc), 0)

  const handleClick = (targetP) => {
    if (!onDotClick) return
    onDotClick(targetP)
  }

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3">
      {sections.map((s, i) => {
        const isActive = active === i
        return (
          <button
            key={s.label}
            onClick={() => handleClick(s.p)}
            className="group flex items-center gap-3 focus:outline-none"
          >
            {/* Hover label */}
            <span
              className="text-[9px] font-mono tracking-widest uppercase transition-all duration-200"
              style={{
                opacity: isActive ? 0.9 : 0,
                color: '#7dd8ff',
                transform: isActive ? 'translateX(0)' : 'translateX(6px)',
                transition: 'all 0.25s ease',
              }}
            >
              {s.label}
            </span>

            {/* Dot */}
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                background: isActive
                  ? '#7dd8ff'
                  : 'rgba(255,255,255,0.2)',
                boxShadow: isActive
                  ? '0 0 12px rgba(125,216,255,0.9), 0 0 4px rgba(125,216,255,0.5)'
                  : 'none',
              }}
            />
          </button>
        )
      })}

      {/* Vertical progress track */}
      <div
        className="absolute right-3.5 top-0 bottom-0 w-px -z-10"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-full transition-all duration-150"
          style={{
            height: `${Math.min(100, scrollProgress * 100)}%`,
            background: 'linear-gradient(to bottom, #7dd8ff, #b388ff)',
            boxShadow: '0 0 6px rgba(125,216,255,0.7)',
            opacity: 0.7,
          }}
        />
      </div>
    </aside>
  )
}
