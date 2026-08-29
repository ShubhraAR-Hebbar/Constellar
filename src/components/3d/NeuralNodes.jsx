import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// ── Custom GLSL Pulse Shader for node cores ────────────────────────────────
const PulseMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color('#7dd8ff'), intensity: 2.0 },
  /* vertex */
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      float pulse = 0.5 + 0.5 * sin(time * 2.2 + vUv.x * 6.28);
      // Fresnel rim glow
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
      vec3 finalColor = color * (intensity * (0.8 + pulse * 0.2));
      finalColor += color * rim * 2.0;
      gl_FragColor = vec4(finalColor, 0.9 + pulse * 0.1);
    }
  `
)
extend({ PulseMaterial })

// ── Single glowing node ───────────────────────────────────────────────────
function GlowNode({ position, color = '#7dd8ff', size = 0.13, pulseOffset = 0, isHovered = false, onOver, onOut }) {
  const matRef = useRef()
  const haloRef = useRef()
  const outerHaloRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + pulseOffset
    if (matRef.current) {
      matRef.current.time = t
      matRef.current.intensity = isHovered ? 4.5 : 2.0 + Math.sin(t * 1.8) * 0.4
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 2.0 + pulseOffset) * 0.12
      haloRef.current.scale.setScalar(s)
    }
    if (outerHaloRef.current) {
      const s2 = 1 + Math.sin(t * 1.2 + pulseOffset + 1) * 0.18
      outerHaloRef.current.scale.setScalar(s2)
      outerHaloRef.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.04
    }
  })

  return (
    <group position={position}>
      {/* Wide outer halo */}
      <mesh ref={outerHaloRef}>
        <sphereGeometry args={[size * 4.5, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Inner tight halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[size * 2.0, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Core sphere */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onOver?.() }}
        onPointerOut={() => onOut?.()}
      >
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 5.0 : 2.5}
          roughness={0.05}
          metalness={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  )
}

// ── Origin hero node ───────────────────────────────────────────────────────
function OriginNode() {
  const ico1 = useRef()
  const ico2 = useRef()
  const cage = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const pulseSphere = useRef()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (ico1.current) { ico1.current.rotation.y += delta * 0.5; ico1.current.rotation.z += delta * 0.2 }
    if (ico2.current) { ico2.current.rotation.y -= delta * 0.3; ico2.current.rotation.x += delta * 0.15 }
    if (cage.current) { cage.current.rotation.x += delta * 0.1; cage.current.rotation.z += delta * 0.07 }
    if (ring1.current) { ring1.current.rotation.z += delta * 0.6; ring1.current.rotation.x = Math.sin(t * 0.4) * 0.5 }
    if (ring2.current) { ring2.current.rotation.y += delta * 0.4; ring2.current.rotation.z = Math.cos(t * 0.35) * 0.4 }
    if (pulseSphere.current) {
      const s = 1.0 + Math.sin(t * 1.5) * 0.12
      pulseSphere.current.scale.setScalar(s)
      pulseSphere.current.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group>
      {/* Wide ambient pulse */}
      <mesh ref={pulseSphere}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial color="#7dd8ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color="#bfe9ff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#e8f8ff" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Spinning icohedra */}
      <mesh ref={ico1}>
        <icosahedronGeometry args={[0.62, 3]} />
        <meshStandardMaterial color="#d0f0ff" emissive="#7dd8ff" emissiveIntensity={3.0} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh ref={ico2} scale={1.18}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial color="#bfe9ff" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh ref={cage} scale={1.6}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial color="#7dd8ff" wireframe transparent opacity={0.12} />
      </mesh>
      {/* Orbital rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.1, 0.02, 16, 80]} />
        <meshStandardMaterial color="#7dd8ff" emissive="#7dd8ff" emissiveIntensity={2.5} transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.45, 0.015, 12, 64]} />
        <meshStandardMaterial color="#b0d8ff" emissive="#90c0ff" emissiveIntensity={1.5} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// ── Skill positions on a Fibonacci sphere ──────────────────────────────────
import { skills } from '../../data/content'

const RADIUS = 5.8
const skillNodes = skills.map((skill, i) => {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const y = 1 - (i / (skills.length - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = goldenAngle * i
  return {
    ...skill,
    position: [RADIUS * r * Math.cos(theta), RADIUS * y * 0.65, RADIUS * r * Math.sin(theta) - 1.8],
  }
})

export default function NeuralNodes({ scrollProgress = 0, hoveredNode, setHoveredNode }) {
  // Labels only show in About section, but nodes always render
  const showLabels = scrollProgress > 0.09 && scrollProgress < 0.28

  return (
    <group>
      <OriginNode />
      {skillNodes.map((s, i) => (
        <GlowNode
          key={s.name}
          position={s.position}
          color={s.nodeColor || '#7dd8ff'}
          size={0.12}
          pulseOffset={i * 0.38}
          isHovered={hoveredNode === s.name}
          onOver={() => setHoveredNode(s.name)}
          onOut={() => setHoveredNode(null)}
        />
      ))}
    </group>
  )
}
