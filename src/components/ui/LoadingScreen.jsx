import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Initialising Constellation…',
  'Calibrating Star Map…',
  'Lighting Neural Nodes…',
  'Rendering Deep Space…',
  'Ready.',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Simulate asset loading with smooth progress
    let start = null
    const DURATION = 2200

    const tick = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      const p = Math.min(100, Math.round((elapsed / DURATION) * 100))
      setProgress(p)
      setMsgIndex(Math.min(MESSAGES.length - 1, Math.floor((p / 100) * MESSAGES.length)))
      if (p < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 600)
        }, 300)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9000] flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, #0a0f2a 0%, #05060f 100%)',
          }}
        >
          {/* Animated constellation icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-10 relative"
          >
            {/* Outer pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
              style={{
                width: 80, height: 80,
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                background: 'radial-gradient(circle, rgba(125,216,255,0.5) 0%, transparent 70%)'
              }}
            />
            {/* Core star */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 48, height: 48,
                  border: '1.5px solid rgba(125,216,255,0.6)',
                  borderRadius: '50%',
                  borderTopColor: '#7dd8ff',
                  borderRightColor: 'transparent',
                  position: 'absolute',
                }}
              />
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #e8f8ff 0%, #7dd8ff 50%, transparent 100%)',
                  boxShadow: '0 0 20px 6px rgba(125,216,255,0.7)',
                }}
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif-hero text-2xl text-slate-100 tracking-widest mb-1"
          >
            CONSTELLATION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[11px] font-mono text-cyan-400/70 tracking-[0.3em] uppercase mb-10"
          >
            Portfolio · Shubhra AR Hebbar
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="w-64 mb-4"
          >
            <div className="h-[2px] bg-slate-800 rounded-full overflow-hidden w-full">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7dd8ff, #b388ff)',
                  boxShadow: '0 0 10px rgba(125,216,255,0.8)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-mono text-slate-500">{MESSAGES[msgIndex]}</span>
              <span className="text-[10px] font-mono text-cyan-400">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
