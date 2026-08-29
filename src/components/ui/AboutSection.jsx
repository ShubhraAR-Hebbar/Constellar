import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Cpu, Zap } from 'lucide-react'
import { profile, skills } from '../../data/content'

const SKILL_CATEGORIES = ['AI/ML', 'Frontend', 'Backend', 'Databases', 'Languages']

const containerV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.28 } },
}
const itemV = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function AboutSection({ scrollProgress = 0 }) {
  const isVisible = scrollProgress >= 0.10 && scrollProgress <= 0.27
  const [activeCategory, setActiveCategory] = useState('AI/ML')

  if (!isVisible) return null

  const filteredSkills = skills.filter(s =>
    activeCategory === 'All' ? true : s.category === activeCategory
  )

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-start px-8 md:px-14 lg:px-20 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key="about"
          variants={containerV}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-2xl w-full pointer-events-auto"
          style={{
            background: 'rgba(7, 10, 28, 0.85)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(125,216,255,0.13)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 0 70px rgba(0,0,0,0.65), 0 0 30px rgba(125,216,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Accent top bar */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #7dd8ff 40%, #b388ff 60%, transparent)' }} />

          <div className="p-8 sm:p-10">
            {/* ── Section label ── */}
            <motion.div variants={itemV} className="flex items-center gap-2 mb-4">
              <Cpu size={13} className="text-cyan-500" />
              <span className="text-[9px] font-mono text-cyan-400/70 tracking-[0.25em] uppercase">02 · About & Skills</span>
            </motion.div>

            {/* ── Heading ── */}
            <motion.h2 variants={itemV} className="font-serif-hero text-2xl sm:text-3xl font-semibold mb-4 leading-tight" style={{ color: '#f0f8ff', textShadow: '0 0 30px rgba(125,216,255,0.2)' }}>
              Engineering AI Systems<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#7dd8ff', textShadow: '0 0 20px rgba(125,216,255,0.4)' }}>
                at Scale
              </em>
            </motion.h2>

            {/* ── Summary ── */}
            <motion.p variants={itemV} className="text-[13px] text-slate-400 leading-[1.78] font-sans-ui mb-6">
              {profile.summary}
            </motion.p>

            {/* ── Skill category filter ── */}
            <motion.div variants={itemV} className="flex flex-wrap gap-2 mb-3">
              {SKILL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'rgba(125,216,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: activeCategory === cat ? '1px solid rgba(125,216,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    color: activeCategory === cat ? '#7dd8ff' : '#64748b',
                    boxShadow: activeCategory === cat ? '0 0 12px rgba(125,216,255,0.25)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* ── Skill tags ── */}
            <motion.div variants={itemV} className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((s, i) => (
                  <motion.span
                    key={s.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.22, delay: i * 0.025 }}
                    className="px-3 py-1 rounded-lg text-[11px] font-mono font-medium"
                    style={{
                      background: `${s.nodeColor}10`,
                      border: `1px solid ${s.nodeColor}30`,
                      color: s.nodeColor,
                    }}
                  >
                    {s.name}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ── Education ── */}
            <motion.div variants={itemV} className="grid grid-cols-2 gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
              {profile.education.map((edu, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl flex items-start gap-2.5"
                  style={{ background: 'rgba(125,216,255,0.03)', border: '1px solid rgba(125,216,255,0.09)' }}
                >
                  <GraduationCap size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-100 leading-snug">{edu.degree}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{edu.institution}</div>
                    <div className="text-[10px] font-mono mt-1.5 font-semibold" style={{ color: '#7dd8ff' }}>{edu.gpa}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
