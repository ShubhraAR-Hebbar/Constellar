import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { leadership, certifications } from '../../data/content'

export default function AchievementsSky({ scrollProgress, hoveredNode, setHoveredNode }) {
  const groupRef = useRef()
  const isVisible = scrollProgress >= 0.74 && scrollProgress <= 0.92

  const achievementNodes = useMemo(() => {
    const nodes = []
    const center = [0, 2, -46]

    leadership.forEach((item, idx) => {
      const angle = (idx / leadership.length) * Math.PI * 2
      const radius = 3.5 + (idx % 2) * 1.2
      nodes.push({
        id: `lead-${idx}`,
        title: `${item.role}`,
        subtitle: item.organization,
        type: 'leadership',
        position: [
          center[0] + Math.cos(angle) * radius,
          center[1] + Math.sin(angle * 0.7) * 1.8,
          center[2] + Math.sin(angle) * radius * 0.5
        ],
        color: '#b388ff',
        size: 0.28
      })
    })

    certifications.forEach((item, idx) => {
      const angle = (idx / certifications.length) * Math.PI * 2 + 0.6
      const radius = 5.5 + (idx % 3) * 0.8
      nodes.push({
        id: `cert-${idx}`,
        title: item.title,
        subtitle: `${item.issuer} · ${item.year}`,
        type: 'certification',
        position: [
          center[0] + Math.cos(angle) * radius,
          center[1] + Math.sin(angle * 0.5) * 3.0 - 0.5,
          center[2] - (idx % 3) * 0.8
        ],
        color: '#7CFFB2',
        size: 0.2
      })
    })

    return nodes
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {achievementNodes.map((node) => {
        const isHovered = hoveredNode === node.id
        return (
          <group key={node.id} position={node.position}>
            {/* Halo */}
            <mesh>
              <sphereGeometry args={[node.size * 2.5, 12, 12]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={isHovered ? 0.45 : 0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Core */}
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); setHoveredNode(node.id) }}
              onPointerOut={() => setHoveredNode(null)}
            >
              <icosahedronGeometry args={[node.size, 2]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isHovered ? 3.5 : 2.0}
                roughness={0.15}
              />
            </mesh>

            {/* Floating label */}
            {isVisible && (
              <Html
                position={[0, node.size * 3, 0]}
                center
                distanceFactor={14}
                style={{ pointerEvents: 'none' }}
              >
                <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-center backdrop-blur-md max-w-[140px] whitespace-normal leading-tight transition-all duration-200 ${
                  isHovered
                    ? 'bg-slate-900/90 text-white border border-cyan-400 shadow-[0_0_15px_rgba(125,216,255,0.5)]'
                    : 'bg-slate-950/75 text-cyan-100/80 border border-slate-700/40'
                }`}>
                  <div className="font-bold text-[10px] leading-tight">{node.title}</div>
                  {node.subtitle && <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{node.subtitle}</div>}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
