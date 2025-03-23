<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import { LineBasicMaterial, BufferGeometry, Float32BufferAttribute } from 'three'
  import { Text } from '@threlte/extras'

  let {
    vertices,
    lines
  }: {
    vertices: { position: [number, number, number]; label: string }[]
    lines: { start: number; end: number }[]
  } = $props()

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
    <T.PerspectiveCamera position={[0, 2, 3]} fov={75} makeDefault>
      <OrbitControls
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.25}
        target={[0, 0, 0]}
      />
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
