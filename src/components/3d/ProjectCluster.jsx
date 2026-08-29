import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export default function ProjectCluster({ position, glowColor, secondaryColor, name }) {
  // Always render at full scale — no scroll gating
  const enter = 1.0

  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const coronaRef = useRef()

  // Fixed satellite positions for each cluster
  const satellites = useMemo(() => [
    { pos: new THREE.Vector3(1.8, 1.0, 0.4), size: 0.16, speed: 1.1 },
    { pos: new THREE.Vector3(-1.6, -0.8, 0.9), size: 0.12, speed: 0.8 },
    { pos: new THREE.Vector3(1.1, -1.4, -0.7), size: 0.2, speed: 1.3 },
    { pos: new THREE.Vector3(-1.3, 1.5, -0.4), size: 0.14, speed: 0.9 },
    { pos: new THREE.Vector3(0.2, 0.8, 2.0), size: 0.1, speed: 1.5 },
  ], [])

  const satRefs = useRef(satellites.map(() => React.createRef()))

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6
      coreRef.current.rotation.x += delta * 0.3
      coreRef.current.material.emissiveIntensity = 1.8 + Math.sin(t * 2) * 0.5
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.4) * 0.2
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.35
      ring2Ref.current.rotation.y += delta * 0.25
    }

    if (coronaRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.08
      coronaRef.current.scale.setScalar(scale)
      coronaRef.current.material.opacity = 0.18 + Math.sin(t * 1.5) * 0.06
    }

    // Satellite bob
    satRefs.current.forEach((ref, i) => {
      if (ref.current) {
        const bob = Math.sin(t * satellites[i].speed + i * 1.1) * 0.12
        ref.current.position.y = satellites[i].pos.y + bob
      }
    })
  })

  return (
    <group position={position} scale={1.0}>
      {/* Wide corona glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[2.0, 24, 24]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner atmosphere */}
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core orb */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.7, 3]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={2.0}
          roughness={0.1}
          metalness={0.85}
        />
      </mesh>

      {/* Outer wireframe cage */}
      <mesh scale={1.35}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial
          color={glowColor}
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Orbital ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.25, 0.022, 16, 64]} />
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbital ring 2 (different axis) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.55, 0.015, 16, 64]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={1.8}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Satellite nodes with spokes */}
      {satellites.map((sat, i) => (
        <group key={i}>
          <group ref={satRefs.current[i]} position={sat.pos}>
            {/* Satellite node */}
            <mesh>
              <sphereGeometry args={[sat.size, 12, 12]} />
              <meshStandardMaterial
                color={glowColor}
                emissive={glowColor}
                emissiveIntensity={2.5}
              />
            </mesh>
            {/* Mini halo around satellite */}
            <mesh>
              <sphereGeometry args={[sat.size * 2.5, 8, 8]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>

          {/* Connection spoke from core to satellite */}
          <Line
            points={[[0, 0, 0], sat.pos.toArray()]}
            color={glowColor}
            lineWidth={1.0}
            transparent
            opacity={0.35}
          />
        </group>
      ))}
    </group>
  )
}
