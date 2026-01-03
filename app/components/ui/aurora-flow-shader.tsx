'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface AuroraFlowShaderProps {
  /** Vertical amplitude of the ribbons */
  amplitude?: number
  /** Horizontal frequency of the ribbons */
  frequency?: number
  /** Extra wrapper classes (e.g. blend modes) */
  className?: string
  /** Inline styles for positioning */
  style?: React.CSSProperties
}

/**
 * AuroraFlowShader
 *
 * Full-screen aurora‐style ribbons that ebb and flow like northern lights.
 * Props drive the ribbon amplitude and frequency. Themed via CSS vars.
 */
export default function AuroraFlowShader({
  amplitude = 0.3,
  frequency = 4.0,
  className = '',
  style = {},
}: AuroraFlowShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial>()

  // Sync props → uniforms
  useEffect(() => {
    const mat = materialRef.current
    if (mat) {
      mat.uniforms.uAmplitude.value = amplitude
      mat.uniforms.uFrequency.value = frequency
    }
  }, [amplitude, frequency])

  // Three.js setup & render loop
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Scene, camera, clock
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const clock = new THREE.Clock()

    // Vertex shader (pass UV)
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    // Fragment shader (aurora ribbons)
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uAmplitude;
      uniform float uFrequency;
      varying vec2 vUv;

      // Simple ridge noise
      float ridge(float x) {
        return abs(2.0 * fract(x) - 1.0);
      }

      void mainImage(out vec4 O, in vec2 uv) {
        vec2 p = uv - 0.5;
        p.x *= iResolution.x / iResolution.y;

        // move ribbons upward over time
        float y = p.y + iTime * 0.1;
        float wave = ridge((p.x * uFrequency) + sin(y * 2.0 + iTime * 0.5));

        // shape ribbon thickness
        float alpha = smoothstep(uAmplitude, uAmplitude + 0.02, wave) 
                    - smoothstep(uAmplitude + 0.02, uAmplitude + 0.04, wave);

        // gradient palette from teal to magenta
        vec3 color = mix(
          vec3(0.2, 0.8, 0.7),
          vec3(0.8, 0.2, 0.7),
          uv.y
        );

        O = vec4(color * alpha, alpha);
      }

      void main() {
        mainImage(gl_FragColor, vUv);
      }
    `

    // Uniforms
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      uAmplitude: { value: amplitude },
      uFrequency: { value: frequency },
    }

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    materialRef.current = material
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.iResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)
    onResize()

    // Render loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize)
      renderer.setAnimationLoop(null)
      container.removeChild(renderer.domElement)
      material.dispose()
      quad.geometry.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      aria-label="Aurora flow shader background"
      className={`bg-background ${className}`}
      ref={containerRef}
      style={style}
    />
  )
}
