import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Camera keyframe waypoints ─────────────────────────────────────────────
// Each entry: { p: scroll %, pos: camera xyz, target: lookAt xyz }
const KEYFRAMES = [
  // Beat 1: HERO — far back, looking at the central glowing node
  { p: 0.00, pos: [0,   0,   14],  target: [0,   0,   0] },
  // Beat 2: ABOUT — push into the skill constellation
  { p: 0.10, pos: [0,   0.5, 9],   target: [0,   0.3, 0] },
  { p: 0.22, pos: [-1, 1.0,  6],   target: [0.5, 0.5, 0] },
  // Beat 3: EXPERIENCE — drift along timeline curve
  { p: 0.30, pos: [2.5, -0.5, 0],  target: [3.5, -1,  -10] },
  { p: 0.40, pos: [-1.5, -1.5, -8], target: [-3.5, -2.5, -16] },
  // Beat 4: PROJECTS — sweep across three clusters
  { p: 0.50, pos: [-4,  1.5, -18], target: [-5,  2.5, -24] },
  { p: 0.60, pos: [2,   -0.5, -24], target: [1,  -1.5, -30] },
  { p: 0.70, pos: [4,   2.5,  -30], target: [5.5, 3.5, -36] },
  // Beat 5: ACHIEVEMENTS — pull back and up into the galaxy sky
  { p: 0.80, pos: [0,   5,   -36],  target: [0,  2.0, -46] },
  { p: 0.88, pos: [2,   4,   -38],  target: [-2, 1.5, -46] },
  // Beat 6: CONTACT — full pullback revealing entire constellation
  { p: 0.95, pos: [0,   6,   12],   target: [0,   0,  -20] },
  { p: 1.00, pos: [0,   5,   15],   target: [0,   0,  -10] },
]

function smoothStep(t) {
  // Cubic smoothstep
  return t * t * (3 - 2 * t)
}

export default function CameraRig({ scrollProgress = 0 }) {
  const { camera } = useThree()
  const targetPosRef = useRef(new THREE.Vector3(0, 0, 14))
  const targetLookRef = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const p = Math.max(0, Math.min(1, scrollProgress))

    // Find the segment
    let i = 0
    for (let k = 0; k < KEYFRAMES.length - 1; k++) {
      if (p >= KEYFRAMES[k].p && p <= KEYFRAMES[k + 1].p) {
        i = k
        break
      }
      if (p > KEYFRAMES[KEYFRAMES.length - 1].p) {
        i = KEYFRAMES.length - 2
      }
    }

    const k1 = KEYFRAMES[i]
    const k2 = KEYFRAMES[Math.min(i + 1, KEYFRAMES.length - 1)]
    const range = k2.p - k1.p
    const local = range > 0.0001 ? (p - k1.p) / range : 0
    const eased = smoothStep(Math.max(0, Math.min(1, local)))

    // Desired position and lookAt from keyframes
    const desiredPos = new THREE.Vector3(
      k1.pos[0] + (k2.pos[0] - k1.pos[0]) * eased,
      k1.pos[1] + (k2.pos[1] - k1.pos[1]) * eased,
      k1.pos[2] + (k2.pos[2] - k1.pos[2]) * eased,
    )
    const desiredLook = new THREE.Vector3(
      k1.target[0] + (k2.target[0] - k1.target[0]) * eased,
      k1.target[1] + (k2.target[1] - k1.target[1]) * eased,
      k1.target[2] + (k2.target[2] - k1.target[2]) * eased,
    )

    // Smooth exponential lerp with weighted damping for buttery camera inertia
    const lerpFactor = 1 - Math.pow(0.005, delta)

    targetPosRef.current.lerp(desiredPos, lerpFactor)
    targetLookRef.current.lerp(desiredLook, lerpFactor)

    // Apply to camera
    camera.position.copy(targetPosRef.current)
    camera.lookAt(targetLookRef.current)
  })

  return null
}
