import React from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

export default function CanvasContainer({ scrollProgress, hoveredNode, setHoveredNode }) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 4,           // THREE.ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        shadows={false}
        onCreated={({ gl }) => {
          gl.setClearColor('#05060f')
        }}
      >
        <Scene
          scrollProgress={scrollProgress}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
        />
      </Canvas>
    </div>
  )
}
