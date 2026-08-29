import React from 'react'
import Starfield from './Starfield'
import NeuralNodes from './NeuralNodes'
import NeuralConnections from './NeuralConnections'
import ProjectCluster from './ProjectCluster'
import AchievementsSky from './AchievementsSky'
import SceneDecorations from './SceneDecorations'
import CameraRig from './CameraRig'
import Effects from './Effects'
import { projects } from '../../data/content'

// Project cluster positions and scroll trigger ranges
const PROJECT_POSITIONS = [
  [-5,   2.5,  -24],  // PlateX (orange)
  [ 1,  -1.5,  -30],  // SentiX (violet)
  [ 5.5, 3.5,  -36],  // EcoTrack (green)
]
const PROJECT_TRIGGER_RANGES = [
  [0.44, 0.58],   // PlateX
  [0.54, 0.68],   // SentiX
  [0.64, 0.78],   // EcoTrack
]

export default function Scene({ scrollProgress, hoveredNode, setHoveredNode }) {
  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} color="#0d1a3a" />
      <directionalLight
        position={[8, 15, 10]}
        intensity={0.8}
        color="#c0e8ff"
        castShadow={false}
      />
      {/* Hero warm fill from slightly below */}
      <pointLight position={[0, -5, 6]} color="#1a2a6c" intensity={3} distance={20} />
      {/* Central node key light */}
      <pointLight position={[0, 2, 3]} color="#7dd8ff" intensity={4} distance={18} />

      {/* ── Camera Journey ── */}
      <CameraRig scrollProgress={scrollProgress} />

      {/* ── Background Stars ── */}
      <Starfield count={2500} />

      {/* ── Scene Decorations: Nebulae, Exp Nodes, Colored Lights ── */}
      <SceneDecorations scrollProgress={scrollProgress} />

      {/* ── Neural Network Core: Nodes & Connections ── */}
      <NeuralNodes
        scrollProgress={scrollProgress}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
      />
      <NeuralConnections scrollProgress={scrollProgress} />

      {/* ── Project Clusters ── */}
      {projects.map((proj, idx) => (
        <ProjectCluster
          key={proj.id}
          position={PROJECT_POSITIONS[idx]}
          glowColor={proj.glowColor}
          secondaryColor={proj.secondaryColor}
          name={proj.name}
        />
      ))}

      {/* ── Achievements Galaxy ── */}
      <AchievementsSky
        scrollProgress={scrollProgress}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
      />

      {/* ── Post Processing ── */}
      <Effects />
    </>
  )
}
