import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Send, MapPin } from 'lucide-react'
import { profile } from '../../data/content'

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function ContactSection({ scrollProgress = 0 }) {
  const isVisible = scrollProgress >= 0.90
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-6 pointer-events-none">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-lg w-full pointer-events-auto text-center"
          style={{
            background: 'rgba(8, 13, 35, 0.82)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '28px',
            border: '1px solid rgba(125,216,255,0.18)',
            boxShadow: '0 0 80px rgba(0,0,0,0.7), 0 0 40px rgba(125,216,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Accent top bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, transparent, #7dd8ff, #b388ff, transparent)' }}
          />

          <div className="px-8 sm:px-10 py-10">
            {/* ── Label ── */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-5">
              <div className="w-6 h-px bg-cyan-500/60" />
              <span className="text-[10px] font-mono text-cyan-400/80 tracking-[0.25em] uppercase">06 · Contact</span>
              <div className="w-6 h-px bg-cyan-500/60" />
            </motion.div>

            {/* ── Headline ── */}
            <motion.h2
              variants={itemVariants}
              className="font-serif-hero font-semibold mb-3 leading-tight text-white"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                textShadow: '0 0 40px rgba(125,216,255,0.25)',
              }}
            >
              Let's Build <span style={{ color: '#7dd8ff', textShadow: '0 0 20px rgba(125,216,255,0.5)' }}>Something</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-[13px] text-slate-400 font-sans-ui leading-relaxed mb-8 max-w-sm mx-auto">
              Open to exciting engineering roles in AI/ML, Full-Stack, or Research Engineering.
            </motion.p>

            {/* ── Contact links ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: <Mail size={15} />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                { icon: <Phone size={15} />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-left group transition-all duration-200"
                  style={{
                    background: 'rgba(125,216,255,0.04)',
                    border: '1px solid rgba(125,216,255,0.12)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(125,216,255,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(125,216,255,0.04)'}
                >
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ background: 'rgba(125,216,255,0.12)', color: '#7dd8ff' }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{item.label}</div>
                    <div className="text-[11px] font-semibold text-slate-200 truncate">{item.value}</div>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* ── Location ── */}
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-7">
              <MapPin size={11} className="text-cyan-500" />
              {profile.location}
            </motion.div>

            {/* ── Social links ── */}
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-3 mb-7">
              {[
                { href: profile.linkedin, icon: <LinkedinIcon />, label: 'LinkedIn' },
                { href: profile.github, icon: <GithubIcon />, label: 'GitHub' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="p-2.5 rounded-xl text-slate-400 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(125,216,255,0.08)'
                    e.currentTarget.style.color = '#7dd8ff'
                    e.currentTarget.style.borderColor = 'rgba(125,216,255,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = ''
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>

            {/* ── Primary CTA ── */}
            <motion.div variants={itemVariants}>
              <a
                href={`mailto:${profile.email}?subject=Opportunity%20-%20Shubhra%20AR%20Hebbar`}
                className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-2xl text-sm font-semibold font-mono text-slate-900 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #7dd8ff, #b388ff)',
                  boxShadow: '0 0 30px rgba(125,216,255,0.4)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 45px rgba(125,216,255,0.6)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(125,216,255,0.4)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Send size={15} />
                Send Me a Message
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
