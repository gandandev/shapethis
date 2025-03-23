<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import { LineBasicMaterial, BufferGeometry, Float32BufferAttribute } from 'three'
  import { Text } from '@threlte/extras'

  type Vertex = {
    position: [number, number, number]
    label: string
  }

  const vertices: Vertex[] = [
    { position: [-0.5, -0.5, -0.5], label: 'E' },
    { position: [0.5, -0.5, -0.5], label: 'H' },
    { position: [-0.5, 0.5, -0.5], label: 'A' },
    { position: [0.5, 0.5, -0.5], label: 'D' },
    { position: [-0.5, -0.5, 0.5], label: 'F' },
    { position: [0.5, -0.5, 0.5], label: 'G' },
    { position: [-0.5, 0.5, 0.5], label: 'B' },
    { position: [0.5, 0.5, 0.5], label: 'C' }
  ]

  const lines = [
    // 아랫면
    { start: 0, end: 1 },
    { start: 0, end: 2 },
    { start: 1, end: 3 },
    { start: 2, end: 3 },
    // 윗면
    { start: 4, end: 5 },
    { start: 4, end: 6 },
    { start: 5, end: 7 },
    { start: 6, end: 7 },
    // 옆 모서리
    { start: 0, end: 4 },
    { start: 1, end: 5 },
    { start: 2, end: 6 },
    { start: 3, end: 7 }
  ]

  const createLineGeometry = () => {
    const geometry = new BufferGeometry()
    const positions: number[] = []

    lines.forEach((line) => {
      const startVertex = vertices[line.start]
      const endVertex = vertices[line.end]

      if (startVertex && endVertex) {
        positions.push(...startVertex.position)
        positions.push(...endVertex.position)
      }
    })

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return geometry
  }

  const lineMaterial = new LineBasicMaterial({ color: 0x000000 })
  const lineGeometry = createLineGeometry()
</script>

<div class="h-screen w-full">
  <Canvas>
    <T.PerspectiveCamera position={[3, 3, 3]} fov={75} makeDefault>
      <OrbitControls enableZoom={true} enableDamping={true} target={[0, 0, 0]} />
    </T.PerspectiveCamera>

    <T.LineSegments geometry={lineGeometry} material={lineMaterial} />

    {#each vertices as vertex}
      <T.Group position={vertex.position}>
        <Billboard>
          <Text
            position={[0, 0, 0]}
            text={vertex.label}
            color="#000000"
            fontSize={0.2}
            font="https://cdn.jsdelivr.net/npm/mathjax-full@3/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff"
            anchorX="center"
            anchorY="middle"
            depthWrite={false}
            renderOrder={1000}
          />
        </Billboard>
      </T.Group>
    {/each}
  </Canvas>
</div>
