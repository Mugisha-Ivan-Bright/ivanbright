import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function HexagonBorder() {
  const glowRef = useRef()
  const trailRef = useRef()
  const { viewport } = useThree()
  const trailCount = 15

  const hexVerts = useMemo(() => {
    const inset = 1.015
    const vw = viewport.width / 2
    const vh = viewport.height / 2
    return [
      new THREE.Vector3(0, vh, 0).multiplyScalar(inset),
      new THREE.Vector3(vw, vh / 2, 0).multiplyScalar(inset),
      new THREE.Vector3(vw, -vh / 2, 0).multiplyScalar(inset),
      new THREE.Vector3(0, -vh, 0).multiplyScalar(inset),
      new THREE.Vector3(-vw, -vh / 2, 0).multiplyScalar(inset),
      new THREE.Vector3(-vw, vh / 2, 0).multiplyScalar(inset),
    ]
  }, [viewport])

  const lineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([...hexVerts, hexVerts[0]])
  }, [hexVerts])

  const edgeLens = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) =>
      hexVerts[i].distanceTo(hexVerts[(i + 1) % 6]),
    )
  }, [hexVerts])

  const trailPos = useMemo(() => new Float32Array(trailCount * 3), [])

  const getPos = useCallback((t) => {
    t = ((t % 1) + 1) % 1
    const totalLen = edgeLens.reduce((a, b) => a + b, 0)
    const target = t * totalLen
    let cum = 0
    for (let i = 0; i < 6; i++) {
      const len = edgeLens[i]
      if (target <= cum + len || i === 5) {
        const local = (target - cum) / len
        return new THREE.Vector3().lerpVectors(hexVerts[i], hexVerts[(i + 1) % 6], local)
      }
      cum += len
    }
    return hexVerts[0].clone()
  }, [hexVerts, edgeLens])

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.18
    const head = getPos(t)
    if (glowRef.current) glowRef.current.position.copy(head)

    const arr = trailRef.current.geometry.attributes.position.array
    for (let i = 0; i < trailCount; i++) {
      const p = getPos(t - (i + 1) * 0.006)
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    }
    trailRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group>
      <line geometry={lineGeo}>
        <lineBasicMaterial color="#00FF87" transparent opacity={0.12} />
      </line>
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={trailCount} array={trailPos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#00FF87" size={0.035} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
      <group ref={glowRef}>
        <mesh>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#00FF87" transparent opacity={0.4} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.03, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <HexagonBorder />
    </Canvas>
  )
}
