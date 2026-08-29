import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Smooth, high-density star field with varied depth layers
export default function Starfield({ count = 2500 }) {
  const pointsRef = useRef()
  const points2Ref = useRef()

  // Layer 1: Far distant tiny stars
  const [pos1, col1] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 40 + Math.random() * 120

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Cool bluish-white stars
      const bright = 0.6 + Math.random() * 0.4
      const blue = Math.random() > 0.7
      colors[i * 3] = bright * (blue ? 0.7 : 0.95)
      colors[i * 3 + 1] = bright * (blue ? 0.85 : 0.95)
      colors[i * 3 + 2] = bright
    }
    return [positions, colors]
  }, [count])

  // Layer 2: Mid-field slightly brighter stars with some cyan tints
  const [pos2, col2] = useMemo(() => {
    const n = Math.floor(count * 0.3)
    const positions = new Float32Array(n * 3)
    const colors = new Float32Array(n * 3)

    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 35

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Cyan-white glow tint
      colors[i * 3] = 0.5 + Math.random() * 0.5
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    }
    return [positions, colors]
  }, [count])

  useFrame((state, delta) => {
    // Very slow drift rotation to feel alive
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.008
      pointsRef.current.rotation.x += delta * 0.003
    }
    if (points2Ref.current) {
      points2Ref.current.rotation.y -= delta * 0.005
      points2Ref.current.rotation.z += delta * 0.002
    }
  })

  return (
    <>
      {/* Distant tiny stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos1, 3]} />
          <bufferAttribute attach="attributes-color" args={[col1, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Mid-field brighter stars */}
      <points ref={points2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos2, 3]} />
          <bufferAttribute attach="attributes-color" args={[col2, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  )
}
