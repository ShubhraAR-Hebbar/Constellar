import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, GraduationCap } from 'lucide-react'

// ── Typewriter cycling roles ──────────────────────────────────────────────
const ROLES = [
  'AI / ML Engineer',
  'Full-Stack Developer',
  'NLP Specialist',
  'ML Pipeline Architect',
  'React & FastAPI Developer',
]

function TypewriterRole() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true) }, 1800)
      return () => clearTimeout(t)
    }
    const target = ROLES[index]
    if (!deleting) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        setPaused(true)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28)
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setIndex(i => (i + 1) % ROLES.length)
      }
    }
  }, [displayed, deleting, paused, index])

  return (
    <span style={{ color: '#7dd8ff' }}>
      {displayed}
      <span style={{
        display: 'inline-block',
        width: '2px',
        height: '1em',
        marginLeft: '2px',
        verticalAlign: 'middle',
        background: '#7dd8ff',
        animation: 'cursor-blink 1s step-end infinite',
      }} />
    </span>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────
const metrics = [
  { value: '8.07', label: 'SGPA' },
  { value: '2',    label: 'Internships' },
  { value: '5',    label: 'Certifications' },
  { value: '3',    label: 'Projects' },
]

export default function HeroSection({ scrollProgress = 0 }) {
  const opacity = Math.max(0, 1 - scrollProgress * 9)
  const ty = scrollProgress * -30

  if (opacity < 0.01) return null

  return (
    <>
      <style>{`
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scroll-line { 0%{transform:translateY(-100%);opacity:0} 40%{opacity:1} 100%{transform:translateY(200%);opacity:0} }
        @keyframes status-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
      `}</style>

      <div
        className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none text-center"
        style={{ opacity, transform: `translateY(${ty}px)`, willChange: 'opacity, transform' }}
      >
        {/* ── Dark radial backdrop so 3D doesn't bleed through text ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,6,18,0.72) 0%, rgba(5,6,15,0.45) 55%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-4">

          {/* ── Status badge ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(125,216,255,0.08)',
              border: '1px solid rgba(125,216,255,0.25)',
              backdropFilter: 'blur(16px)',
              color: '#7dd8ff',
              fontSize: '10px', fontFamily: 'monospace',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7dd8ff', animation: 'status-pulse 2s ease-in-out infinite' }} />
            Open to Work · Remote & On-Site
          </motion.div>

          {/* ── Name — solid bright white, NO transparent clip ── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 300,
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              /* Solid bright white — readable over any 3D background */
              color: '#ffffff',
              /* Strong glow makes it pop above the 3D scene */
              textShadow: '0 0 60px rgba(125,216,255,0.5), 0 0 120px rgba(125,216,255,0.2), 0 2px 20px rgba(0,0,0,0.9)',
              /* Dark text "ground" stops the 3D from bleeding through */
              filter: 'drop-shadow(0 0 2px rgba(5,6,15,1)) drop-shadow(0 0 8px rgba(5,6,15,0.9))',
              userSelect: 'none',
            }}
          >
            Shubhra AR<br />
            <em style={{ fontStyle: 'italic', fontWeight: 200 }}>Hebbar</em>
          </motion.h1>

          {/* ── Divider rule ── */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '120px', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(125,216,255,0.55), transparent)',
            }}
          />

          {/* ── Typewriter role ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '28px' }}
          >
            <span style={{ color: '#4a5568', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Currently a
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, minWidth: '220px', textAlign: 'left' }}>
              <TypewriterRole />
            </span>
          </motion.div>

          {/* ── Location / education ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <GraduationCap size={12} style={{ color: '#38bdf8' }} />
              MCA · Atria Institute of Technology
            </span>
            <span style={{ color: '#1e293b' }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={12} style={{ color: '#38bdf8' }} />
              Bengaluru, India
            </span>
          </motion.div>

          {/* ── Metrics row ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '8px' }}
          >
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.07, duration: 0.4 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '12px 18px', borderRadius: '16px',
                  background: 'rgba(10,14,40,0.7)',
                  border: '1px solid rgba(125,216,255,0.12)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <span style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '22px', fontWeight: 600,
                  color: '#e2f4ff',
                  textShadow: '0 0 20px rgba(125,216,255,0.5)',
                }}>
                  {m.value}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '3px' }}>
                  {m.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Scroll cue ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '24px' }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#334155', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Scroll to Explore
            </span>
            <div style={{ width: '1px', height: '36px', background: 'rgba(30,41,59,0.8)', overflow: 'hidden', position: 'relative', borderRadius: '1px' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '60%',
                background: 'linear-gradient(to bottom, transparent, #7dd8ff)',
                animation: 'scroll-line 1.5s ease-in-out infinite',
              }} />
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}
