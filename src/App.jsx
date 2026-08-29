import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CanvasContainer from './components/3d/CanvasContainer'
import Navbar from './components/ui/Navbar'
import ScrollProgress from './components/ui/ScrollProgress'
import HeroSection from './components/ui/HeroSection'
import AboutSection from './components/ui/AboutSection'
import TimelineSection from './components/ui/TimelineSection'
import ProjectsSection from './components/ui/ProjectsSection'
import AchievementsSection from './components/ui/AchievementsSection'
import ContactSection from './components/ui/ContactSection'
import MotionFallback from './components/ui/MotionFallback'
import LoadingScreen from './components/ui/LoadingScreen'
import CustomCursor from './components/ui/CustomCursor'
import ChatbotModal from './components/ui/ChatbotModal'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)
  const lenisRef = useRef(null)
  const audioCtxRef = useRef(null)

  // ── Detect prefers-reduced-motion ──────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setIsReducedMotion(true)
    const h = (e) => setIsReducedMotion(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // ── Lenis Smooth Scroll + GSAP ScrollTrigger Integration ───────────────
  useEffect(() => {
    if (isReducedMotion || !loaded) return

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.6,  // Responsive scroll sensitivity
      touchMultiplier: 2.0,
    })
    lenisRef.current = lenis

    function updateLenis(time) {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        snap: {
          snapTo: [0.0, 0.18, 0.32, 0.48, 0.58, 0.68, 0.82, 0.95],
          duration: { min: 0.25, max: 0.6 },
          delay: 0.1,
          ease: 'power1.inOut',
        },
        onUpdate: (self) => setScrollProgress(self.progress),
      })
    })

    return () => {
      ctx.revert()
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isReducedMotion, loaded])

  // ── Ambient audio drone ────────────────────────────────────────────────
  useEffect(() => {
    if (!isAudioOn) {
      audioCtxRef.current?.close()
      audioCtxRef.current = null
      return
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0, ctx.currentTime)
      masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
      masterGain.connect(ctx.destination)
      const freqs = [55, 82.5, 110, 165]
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = i % 2 === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq + Math.random() * 0.5, ctx.currentTime)
        g.gain.setValueAtTime(0.3 / freqs.length, ctx.currentTime)
        osc.connect(g)
        g.connect(masterGain)
        osc.start()
      })
    } catch (e) {
      console.warn('AudioContext blocked:', e)
    }
    return () => { audioCtxRef.current?.close(); audioCtxRef.current = null }
  }, [isAudioOn])

  // ── Section jump handler (Lenis smooth scrollTo) ─────────────────────
  const handleDotClick = useCallback((targetRatio) => {
    if (containerRef.current && lenisRef.current) {
      const scrollable = containerRef.current.offsetHeight - window.innerHeight
      const targetY = targetRatio * scrollable
      lenisRef.current.scrollTo(targetY, { duration: 1.2 })
    } else {
      const maxScroll = (document.documentElement.scrollHeight || 3000) - window.innerHeight
      const targetY = targetRatio * Math.max(maxScroll, 0)
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="relative bg-[#05060f] text-slate-100 min-h-screen">
      {/* ── Custom Cursor (desktop only) ── */}
      <CustomCursor />

      {/* ── Cinematic Loading Screen ── */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* ── Persistent Navbar ── */}
      <Navbar
        isReducedMotion={isReducedMotion}
        setIsReducedMotion={setIsReducedMotion}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />

      {isReducedMotion ? (
        <MotionFallback />
      ) : (
        <>
          {/* Right scroll progress & dot nav */}
          <ScrollProgress scrollProgress={scrollProgress} onDotClick={handleDotClick} />

          {/* Fixed 3D Canvas */}
          <CanvasContainer
            scrollProgress={scrollProgress}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
          />

          {/* UI Overlays — each manages its own visibility via scrollProgress range */}
          <HeroSection scrollProgress={scrollProgress} />
          <AboutSection scrollProgress={scrollProgress} />
          <TimelineSection scrollProgress={scrollProgress} />
          <ProjectsSection scrollProgress={scrollProgress} />
          <AchievementsSection scrollProgress={scrollProgress} />
          <ContactSection scrollProgress={scrollProgress} />

          {/* Optimized scroll-driver div — 450vh for effortless section navigation */}
          <div
            ref={containerRef}
            className="relative w-full z-10 pointer-events-none"
            style={{ height: '450vh' }}
          />
        </>
      )}

      {/* ── Cosmic AI Co-Pilot Chatbot ── */}
      <ChatbotModal
        onNavigate={handleDotClick}
        isReducedMotion={isReducedMotion}
        setIsReducedMotion={setIsReducedMotion}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />
    </div>
  )
}

