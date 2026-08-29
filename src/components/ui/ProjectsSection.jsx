import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Layers, Code2, Cpu, Database, Globe } from 'lucide-react'
import { projects } from '../../data/content'

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Category icon mapper
const STACK_ICONS = { Python: Cpu, 'React.js': Code2, FastAPI: Globe, MongoDB: Database, Flask: Globe }

// Project visual "fingerprint" bars — unique pattern per project
const PROJECT_META = [
  { type: 'AI Vision', category: 'Computer Vision + Web', impact: 'Diet tracking · Calorie estimation', bars: [0.92, 0.78, 0.65, 0.88, 0.55] },
  { type: 'NLP Tool',  category: 'Sentiment Analysis',    impact: 'Code-mixed language · LLM powered', bars: [0.85, 0.70, 0.95, 0.60, 0.80] },
  { type: 'GreenTech', category: 'Sustainability + Data', impact: 'CO₂ tracking · Emission insights',   bars: [0.70, 0.88, 0.75, 0.90, 0.65] },
]

const variants = {
  hidden:  { opacity: 0, y: 28, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -18, scale: 0.96, transition: { duration: 0.28 } },
}

const itemV = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function ProjectsSection({ scrollProgress = 0 }) {
  const ranges = [[0.47, 0.58], [0.58, 0.68], [0.68, 0.77]]
  const idx = ranges.findIndex(([s, e]) => scrollProgress >= s && scrollProgress < e)
  if (idx === -1) return null

  const proj = projects[idx]
  const meta = PROJECT_META[idx]
  const accent = proj.glowColor
  const rgb = accent === '#ffb86b' ? '255,184,107' : accent === '#b388ff' ? '179,136,255' : '124,255,178'

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-6 md:px-16 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={proj.name}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-5xl pointer-events-auto"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
        >
          {/* ─── LEFT: Main card ─────────────────────────────────────── */}
          <motion.div
            style={{
              background: 'rgba(7, 10, 28, 0.85)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderRadius: '24px',
              border: `1px solid rgba(${rgb}, 0.22)`,
              boxShadow: `0 0 60px rgba(0,0,0,0.7), 0 0 40px rgba(${rgb}, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
              overflow: 'hidden',
            }}
          >
            {/* Accent top bar + corner dots */}
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${accent} 60%, transparent 100%)` }} />
            <div className="p-8">
              {/* Header row */}
              <motion.div variants={itemV} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
                    style={{ background: `rgba(${rgb}, 0.12)`, border: `1px solid rgba(${rgb}, 0.3)`, color: accent }}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-slate-500">Featured Project</div>
                    <div className="text-[10px] font-mono" style={{ color: accent }}>{meta.type}</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2.5 py-1 rounded-full" style={{ background: `rgba(${rgb}, 0.08)`, border: `1px solid rgba(${rgb}, 0.2)`, color: accent }}>
                  {meta.category}
                </span>
              </motion.div>

              {/* Project name */}
              <motion.h2
                variants={itemV}
                className="font-serif-hero font-bold mb-1 leading-none"
                style={{
                  fontSize: 'clamp(2.8rem, 5vw, 3.6rem)',
                  color: '#ffffff',
                  textShadow: `0 0 50px ${accent}60, 0 2px 12px rgba(0,0,0,0.8)`,
                }}
              >
                {proj.name}
              </motion.h2>

              <motion.div variants={itemV} className="text-[10px] font-mono text-slate-500 mb-5 italic">{meta.impact}</motion.div>

              {/* Description */}
              <motion.p variants={itemV} className="text-[13px] text-slate-300 leading-[1.8] mb-6 font-sans-ui">
                {proj.description}
              </motion.p>

              {/* Tech stack */}
              <motion.div variants={itemV} className="mb-7">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Layers size={11} style={{ color: accent }} />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.stack.map((s, i) => {
                    const Icon = STACK_ICONS[s]
                    return (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-200"
                        style={{ background: `rgba(${rgb}, 0.06)`, border: `1px solid rgba(${rgb}, 0.12)` }}
                      >
                        {Icon && <Icon size={11} style={{ color: accent }} />}
                        {s}
                      </span>
                    )
                  })}
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={itemV} className="flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold font-mono transition-all duration-200"
                  style={{ background: `rgba(${rgb}, 0.1)`, border: `1px solid rgba(${rgb}, 0.3)`, color: accent }}
                  onMouseEnter={e => e.currentTarget.style.background = `rgba(${rgb}, 0.2)`}
                  onMouseLeave={e => e.currentTarget.style.background = `rgba(${rgb}, 0.1)`}
                >
                  <GithubIcon size={13} /> View on GitHub
                </a>
                <a
                  href={proj.demo}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-mono text-slate-500 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                >
                  <ArrowUpRight size={13} /> Live Demo
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* ─── RIGHT: Stats + Visual panel ─────────────────────────── */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Fingerprint bar chart */}
            <motion.div
              variants={itemV}
              style={{
                background: 'rgba(7, 10, 28, 0.8)',
                backdropFilter: 'blur(24px)',
                borderRadius: '20px',
                border: `1px solid rgba(${rgb}, 0.16)`,
                padding: '24px',
                flex: 1,
              }}
            >
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-5">Capability Profile</div>
              {['Complexity', 'AI Depth', 'UX Polish', 'Scale', 'Innovation'].map((label, i) => (
                <div key={i} className="mb-3.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{label}</span>
                    <span className="text-[10px] font-mono" style={{ color: accent }}>{Math.round(meta.bars[i] * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.bars[i] * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, rgba(${rgb},0.5), ${accent})`, boxShadow: `0 0 8px rgba(${rgb},0.6)` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Status badge row */}
            <motion.div
              variants={itemV}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: 'Status', value: 'Completed', icon: '✓' },
                { label: 'Type', value: 'Open Source', icon: '◉' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(7,10,28,0.8)', backdropFilter: 'blur(16px)', border: `1px solid rgba(${rgb},0.12)` }}
                >
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: accent, fontSize: '14px' }}>{item.icon}</span>
                    <span className="text-[13px] font-semibold text-slate-100 font-sans-ui">{item.value}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
