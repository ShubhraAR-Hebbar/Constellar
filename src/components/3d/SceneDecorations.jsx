import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Distant nebula cloud patches for depth ───────────────────────────────
function NebulaPatch({ position, color, radius }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.04 + Math.sin(state.clock.getElapsedTime() * 0.3 + position[0]) * 0.015
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// ─── Experience timeline anchor nodes ────────────────────────────────────
function ExperienceNode({ position, color, label }) {
  const ringRef = useRef()
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6
    }
  })
  return (
    <group position={position}>
      {/* Large soft halo */}
      <mesh>
        <sphereGeometry args={[1.0, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.45, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Spinning ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.65, 0.025, 12, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

export default function SceneDecorations({ scrollProgress }) {
  return (
    <>
      {/* ── Deep space nebula patches for ambient glow ── */}
      <NebulaPatch position={[-30, 10, -60]} color="#1a2a5e" radius={22} />
      <NebulaPatch position={[25, -15, -55]} color="#0d2a20" radius={18} />
      <NebulaPatch position={[0, 20, -80]} color="#1a0d2e" radius={28} />
      <NebulaPatch position={[-20, -8, -30]} color="#0b1a3a" radius={15} />
      <NebulaPatch position={[18, 12, -20]} color="#0a1e1e" radius={14} />

      {/* ── Experience timeline anchor nodes ── */}
      <ExperienceNode
        position={[3.5, -1, -10]}
        color="#bfe9ff"
        label="PAT Technologies"
      />
      <ExperienceNode
        position={[-3.5, -2.5, -16]}
        color="#90caf9"
        label="CodeLab Systems"
      />

      {/* ── Ambient point lights at each project cluster ── */}
      <pointLight position={[-5, 2.5, -24]} color="#ffb86b" intensity={3.5} distance={12} />
      <pointLight position={[1, -1.5, -30]} color="#b388ff" intensity={3.5} distance={12} />
      <pointLight position={[5.5, 3.5, -36]} color="#7CFFB2" intensity={3.5} distance={12} />

      {/* ── Ambient light at experience nodes ── */}
      <pointLight position={[3.5, -1, -10]} color="#bfe9ff" intensity={2.5} distance={10} />
      <pointLight position={[-3.5, -2.5, -16]} color="#90caf9" intensity={2.5} distance={10} />
    </>
  )
}
