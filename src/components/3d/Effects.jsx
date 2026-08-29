import React from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

export default function Effects() {
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* Cinematic bloom — strong but not gamer */}
      <Bloom
        intensity={2.0}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.9}
        height={400}
        kernelSize={4}
        blendFunction={BlendFunction.ADD}
      />
      {/* Subtle vignette — darkens edges for cinema feel */}
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* Very subtle chromatic aberration for premium glass-like quality */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0005, 0.0005)}
      />
    </EffectComposer>
  )
}
