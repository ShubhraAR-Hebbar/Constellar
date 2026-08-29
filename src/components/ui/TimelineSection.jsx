import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { experience } from '../../data/content'

const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.3 } }
}

export default function TimelineSection({ scrollProgress = 0 }) {
  const isNodeA = scrollProgress >= 0.26 && scrollProgress < 0.37
  const isNodeB = scrollProgress >= 0.37 && scrollProgress <= 0.46
  if (!isNodeA && !isNodeB) return null

  const exp = isNodeA ? experience[0] : experience[1]
  const nodeLabel = isNodeA ? 'A' : 'B'

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-end px-8 md:px-16 lg:px-24 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={exp.company}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-lg w-full pointer-events-auto"
          style={{
            background: 'rgba(8, 13, 35, 0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(125,216,255,0.15)',
            borderRadius: '24px',
            padding: '36px 40px',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(125,216,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* ── Label ── */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-px bg-cyan-500/60" />
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-[0.25em] uppercase">
              03 · Experience · Node {nodeLabel}
            </span>
          </div>

          {/* ── Company & Role ── */}
          <h2 className="font-serif-hero text-2xl font-semibold text-white mb-1 leading-tight">{exp.company}</h2>
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold"
              style={{
                background: 'rgba(125,216,255,0.1)',
                border: '1px solid rgba(125,216,255,0.25)',
                color: '#7dd8ff',
              }}
            >
              {exp.role}
            </span>
          </div>

          {/* ── Meta ── */}
          <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-500 mb-5">
            <span className="flex items-center gap-1.5 text-cyan-400/80">
              <Calendar size={12} />
              {exp.dates}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {exp.location}
            </span>
          </div>

          {/* ── Bullets ── */}
          <div className="space-y-3 mb-6">
            {exp.bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-300 leading-relaxed font-sans-ui">{bullet}</p>
              </div>
            ))}
          </div>

          {/* ── Tech tags ── */}
          <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {exp.tech.map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
