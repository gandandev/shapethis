<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import { LineBasicMaterial, BufferGeometry, Float32BufferAttribute } from 'three'
  import { Text } from '@threlte/extras'

  type Object = {
    position?: [number, number, number]
    vertices: { position: [number, number, number]; label: string }[]
    lines: { start: string; end: string }[]
  }

  let { objects }: { objects: Object[] } = $props()

  const createLineGeometry = () => {
    const geometry = new BufferGeometry()
    const positions: number[] = []

    objects.forEach((object) => {
      const objPosition = object.position || [0, 0, 0]
      object.lines.forEach((line) => {
        const vertexMap = Object.fromEntries(object.vertices.map((v, i) => [v.label, v]))

        const startVertex = vertexMap[line.start]
        const endVertex = vertexMap[line.end]

        if (startVertex && endVertex) {
          positions.push(
            startVertex.position[0] + objPosition[0],
            startVertex.position[1] + objPosition[1],
            startVertex.position[2] + objPosition[2]
          )
          positions.push(
            endVertex.position[0] + objPosition[0],
            endVertex.position[1] + objPosition[1],
            endVertex.position[2] + objPosition[2]
          )
        }
      })
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

    {#each objects as object}
      {#each object.vertices as vertex}
        <T.Group
          position={[
            vertex.position[0] + (object.position?.[0] || 0),
            vertex.position[1] + (object.position?.[1] || 0),
            vertex.position[2] + (object.position?.[2] || 0)
          ]}
        >
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
    {/each}
  </Canvas>
</div>
