import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export const NODE_POSITIONS = {
  origin:       [0,    0,    0],
  skillsCenter: [0,    0.5,  -2],
  patTech:      [3.5,  -1,   -10],
  codeLab:      [-3.5, -2.5, -16],
  platex:       [-5,   2.5,  -24],
  sentix:       [1,    -1.5, -30],
  ecotrack:     [5.5,  3.5,  -36],
  achievements: [0,    2,    -46],
}

// ── Traveling signal dot ───────────────────────────────────────────────────
function SignalDot({ from, to, color, speed, offset = 0 }) {
  const meshRef = useRef()
  const fromV = useMemo(() => new THREE.Vector3(...from), [from])
  const toV   = useMemo(() => new THREE.Vector3(...to),   [to])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = ((state.clock.getElapsedTime() * speed + offset) % 1.0)
    meshRef.current.position.lerpVectors(fromV, toV, t)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6.0} />
    </mesh>
  )
}

// ── All connections — always fully rendered ────────────────────────────────
export default function NeuralConnections() {
  const p = NODE_POSITIONS

  // Every link always fully visible with signal dots running
  const LINKS = [
    { start: p.origin,       end: p.skillsCenter, color: '#7dd8ff', signals: 2, speed: 0.35 },
    { start: p.skillsCenter, end: p.patTech,       color: '#bfe9ff', signals: 1, speed: 0.28 },
    { start: p.patTech,      end: p.codeLab,       color: '#90caf9', signals: 2, speed: 0.32 },
    { start: p.codeLab,      end: p.platex,        color: '#ffb86b', signals: 1, speed: 0.30 },
    { start: p.platex,       end: p.sentix,        color: '#b388ff', signals: 2, speed: 0.35 },
    { start: p.sentix,       end: p.ecotrack,      color: '#7CFFB2', signals: 1, speed: 0.28 },
    { start: p.ecotrack,     end: p.achievements,  color: '#7dd8ff', signals: 2, speed: 0.22 },
    // Cross-links
    { start: p.skillsCenter, end: p.platex,        color: '#7dd8ff', signals: 1, speed: 0.20 },
    { start: p.patTech,      end: p.sentix,        color: '#7dd8ff', signals: 1, speed: 0.18 },
    { start: p.codeLab,      end: p.ecotrack,      color: '#7dd8ff', signals: 1, speed: 0.20 },
    { start: p.platex,       end: p.achievements,  color: '#b388ff', signals: 1, speed: 0.16 },
    { start: p.ecotrack,     end: p.sentix,        color: '#7CFFB2', signals: 1, speed: 0.19 },
  ]

  return (
    <group>
      {LINKS.map((link, idx) => (
        <group key={idx}>
          {/* Outer glow line */}
          <Line
            points={[link.start, link.end]}
            color={link.color}
            lineWidth={1.8}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
          {/* Bright core line */}
          <Line
            points={[link.start, link.end]}
            color="#ffffff"
            lineWidth={0.5}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
          />
          {/* Traveling signal dots */}
          {Array.from({ length: link.signals }).map((_, si) => (
            <SignalDot
              key={si}
              from={link.start}
              to={link.end}
              color={link.color}
              speed={link.speed}
              offset={si / link.signals}
            />
          ))}
        </group>
      ))}
    </group>
  )
}
