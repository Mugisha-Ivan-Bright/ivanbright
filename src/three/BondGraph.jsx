import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const R = 5.0
const S = Math.sqrt(3) / 2

const HEX_ANGLES = [0, 60, 120, 180, 240, 300]

function buildNodes(projects) {
  const list = [
    { id: 'mib', label: 'MIB', x: 0, y: 0, r: 0.6, project: null },
  ]
  projects.slice(0, 6).forEach((p, i) => {
    const rad = HEX_ANGLES[i] * Math.PI / 180
    list.push({
      id: p.name || `proj-${i}`,
      label: p.name || `Project ${i + 1}`,
      x: Math.cos(rad) * R,
      y: Math.sin(rad) * R,
      r: 0.45,
      project: p,
    })
  })
  return list
}

function makeBonds(nodes) {
  const bonds = []
  for (let i = 1; i < nodes.length; i++) {
    bonds.push({ from: nodes[0].id, to: nodes[i].id, strength: 0.7 + Math.random() * 0.2 })
  }
  return bonds
}

function buildCurve(fromNode, toNode, seed) {
  const mx = (fromNode.x + toNode.x) / 2
  const my = (fromNode.y + toNode.y) / 2
  const nx = -(toNode.y - fromNode.y)
  const ny = toNode.x - fromNode.x
  const len = Math.sqrt(nx * nx + ny * ny) || 1
  const offset = 0.3 + (seed % 5) * 0.08
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z || 0),
    new THREE.Vector3(mx + (nx / len) * offset, my + (ny / len) * offset, (seed % 3 - 1) * 0.2),
    new THREE.Vector3(toNode.x, toNode.y, toNode.z || 0),
  ])
}

function ProjectCard({ project }) {
  if (!project) return null
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #222',
        padding: '16px',
        minWidth: '240px',
        maxWidth: '280px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
        {project.name}
        <span style={{ color: '#00FF87', marginLeft: '8px', fontSize: '11px' }}>
          {project.tagline || ''}
        </span>
      </div>
      {project.desc && (
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#888', lineHeight: 1.6, margin: '0 0 10px' }}>
          {project.desc}
        </p>
      )}
      {project.tech && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#00FF87',
                border: '1px solid #00FF87',
                padding: '2px 8px',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div style={{ marginTop: '10px', fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#00FF87' }}>
        view on github →
      </div>
    </div>
  )
}

function Scene({ projects }) {
  const nodes = useMemo(() => buildNodes(projects), [projects])
  const bonds = useMemo(() => makeBonds(nodes), [nodes])
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])

  const particlesRef = useRef()
  const pT = useRef([])
  const bondOpacity = useRef([])
  const [hovered, setHovered] = useState(null)
  const raycaster = useRef(new THREE.Raycaster())
  const nodeMeshes = useRef({})

  const sceneData = useMemo(() => {
    const curves = bonds.map((b, i) => {
      const n1 = nodeMap[b.from]
      const n2 = nodeMap[b.to]
      return buildCurve(n1, n2, i * 7 + 3)
    })
    return { curves }
  }, [bonds, nodeMap])

  const { curves } = sceneData

  const pointsData = useMemo(() => {
    const pos = []
    const ts = []
    bonds.forEach((b, bi) => {
      const count = 18
      for (let i = 0; i < count; i++) {
        const t = i / count
        const pt = curves[bi].getPoint(t)
        pos.push(pt.x, pt.y, pt.z)
        ts.push(t)
      }
    })
    return { positions: new Float32Array(pos), tVals: ts }
  }, [bonds, curves])

  useEffect(() => {
    pT.current = [...pointsData.tVals]
  }, [pointsData.tVals])

  const particlePositions = useMemo(() => new Float32Array(pointsData.positions), [pointsData.positions])

  useFrame((state) => {
    raycaster.current.setFromCamera(state.pointer, state.camera)
    const meshes = Object.values(nodeMeshes.current).filter(Boolean)
    const hits = raycaster.current.intersectObjects(meshes)
    const hitId = hits.length ? hits[0].object.userData.nodeId : null
    if (hitId !== hovered) setHovered(hitId)

    bonds.forEach((b, i) => {
      const t = hitId && (b.from === hitId || b.to === hitId) ? 0.6 : 0.2
      if (!bondOpacity.current[i]) bondOpacity.current[i] = 0.2
      bondOpacity.current[i] += (t - bondOpacity.current[i]) * 0.04
    })

    const speed = 0.0008 * (1 + Math.sin(state.clock.elapsedTime * 0.08) * 0.3)
    const count = 18
    let pi = 0
    bonds.forEach((b, bi) => {
      for (let i = 0; i < count; i++) {
        let t = pT.current[pi] + speed
        if (t > 1) t -= 1
        pT.current[pi] = t
        const pt = curves[bi].getPoint(t)
        const arr = particlesRef.current.geometry.attributes.position.array
        arr[pi * 3] = pt.x
        arr[pi * 3 + 1] = pt.y
        arr[pi * 3 + 2] = pt.z
        pi++
      }
    })
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!bondOpacity.current.length) bondOpacity.current = bonds.map(() => 0.2)

  const hoveredProject = hovered && hovered !== 'mib'
    ? nodes.find((n) => n.id === hovered)?.project
    : null

  return (
    <group position={[0, -2, 0]}>
      {bonds.map((b, i) => {
        const pts = curves[i].getPoints(28)
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        return (
          <line key={`${b.from}-${b.to}`} geometry={geo}>
            <lineBasicMaterial color="#00FF87" transparent opacity={bondOpacity.current[i] ?? 0.15} />
          </line>
        )
      })}

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointsData.positions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#00FF87" size={0.04} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>

      {nodes.map((node) => (
        <group key={node.id}>
          <mesh
            ref={(el) => { nodeMeshes.current[node.id] = el }}
            userData={{ nodeId: node.id }}
            position={[node.x, node.y, node.z || 0]}
          >
            <circleGeometry args={[node.r, 24]} />
            <meshBasicMaterial color={node.id === 'mib' ? '#ffffff' : '#cccccc'} />
          </mesh>
          <mesh position={[node.x, node.y, node.z || 0]}>
            <circleGeometry args={[node.r * 1.5, 24]} />
            <meshBasicMaterial color="#00FF87" transparent opacity={hovered === node.id ? 0.2 : 0.06} />
          </mesh>

          {hovered === node.id && node.id !== 'mib' && (
            <Html
              position={[node.x + (node.x > 0 ? 0.8 : -0.8), node.y + 0.2, 0]}
              center={false}
              distanceFactor={8}
              style={{ pointerEvents: 'none' }}
            >
              <ProjectCard project={node.project} />
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

export default function BondGraph({ projects = [] }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene projects={projects} />
    </Canvas>
  )
}
