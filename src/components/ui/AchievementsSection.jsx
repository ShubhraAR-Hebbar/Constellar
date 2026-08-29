import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Star } from 'lucide-react'
import { leadership, certifications } from '../../data/content'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.3 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export default function AchievementsSection({ scrollProgress = 0 }) {
  const isVisible = scrollProgress >= 0.77 && scrollProgress <= 0.90
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-6 md:px-12 pointer-events-none">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-4xl w-full pointer-events-auto"
          style={{
            background: 'rgba(8, 13, 35, 0.80)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(125,216,255,0.12)',
            borderRadius: '28px',
            padding: '36px 40px',
            maxHeight: '84vh',
            overflowY: 'auto',
            boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(125,216,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* ── Label ── */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-cyan-500/60" />
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-[0.25em] uppercase">05 · Achievements</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-serif-hero text-2xl sm:text-3xl font-semibold text-white mb-7">
            Leadership &{' '}
            <span style={{ color: '#7CFFB2', textShadow: '0 0 20px rgba(124,255,178,0.4)' }}>
              Certifications
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Leadership ── */}
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
                <Star size={13} className="text-purple-400" />
                <span className="text-[10px] font-mono text-purple-300/80 uppercase tracking-widest">Leadership Roles</span>
              </motion.div>
              <div className="space-y-2.5">
                {leadership.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-3.5 rounded-xl group transition-all duration-200 cursor-default"
                    style={{
                      background: 'rgba(179,136,255,0.04)',
                      border: '1px solid rgba(179,136,255,0.1)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(179,136,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(179,136,255,0.04)'}
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-[12px] font-semibold text-white font-sans-ui">{item.role}</span>
                      <span className="text-[10px] font-mono text-purple-400 shrink-0">{item.organization}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Certifications ── */}
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase tracking-widest">Certifications</span>
              </motion.div>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-3 rounded-xl flex items-center justify-between gap-3 group transition-all duration-200 cursor-default"
                    style={{
                      background: 'rgba(124,255,178,0.04)',
                      border: '1px solid rgba(124,255,178,0.1)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,255,178,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,255,178,0.04)'}
                  >
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-slate-100 font-sans-ui leading-snug truncate">{cert.title}</div>
                      <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">{cert.issuer}</div>
                    </div>
                    <span
                      className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold"
                      style={{
                        background: 'rgba(124,255,178,0.12)',
                        border: '1px solid rgba(124,255,178,0.3)',
                        color: '#7CFFB2',
                      }}
                    >
                      {cert.year}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
