<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import {
    LineBasicMaterial,
    BufferGeometry,
    Float32BufferAttribute,
    MeshBasicMaterial,
    DoubleSide
  } from 'three'
  import { Text } from '@threlte/extras'

  type Object = {
    position?: [number, number, number]
    vertices: {
      position: [number, number, number]
      label: string
      show?: boolean
    }[]
    lines: { start: string; end: string }[]
    faces?: { vertices: string[] }[]
    options?: {
      showVertices?: boolean
      mode?: 'wireframe' | 'solid'
      color?: string
    }
  }

  const DEFAULT_OPTIONS = {
    showVertices: true,
    mode: 'wireframe' as const,
    color: '#000000'
  }

  let { objects }: { objects: Object[] } = $props()

  $effect(() => {
    objects = objects.map((obj) => ({
      ...obj,
      options: { ...DEFAULT_OPTIONS, ...obj.options }
    }))
  })

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

  const createFaceGeometry = (object: Object) => {
    if (!object.faces || object.faces.length === 0) return null

    const geometry = new BufferGeometry()
    const positions: number[] = []
    const indices: number[] = []

    const objPosition = object.position || [0, 0, 0]
    const vertexMap = Object.fromEntries(object.vertices.map((v) => [v.label, v]))

    const uniqueVertices = new Map()
    object.vertices.forEach((vertex, index) => {
      const position = vertex.position
      positions.push(
        position[0] + objPosition[0],
        position[1] + objPosition[1],
        position[2] + objPosition[2]
      )
      uniqueVertices.set(vertex.label, index)
    })

    object.faces.forEach((face) => {
      if (face.vertices.length >= 3) {
        for (let i = 1; i < face.vertices.length - 1; i++) {
          const v0 = uniqueVertices.get(face.vertices[0])
          const v1 = uniqueVertices.get(face.vertices[i])
          const v2 = uniqueVertices.get(face.vertices[i + 1])

          if (v0 !== undefined && v1 !== undefined && v2 !== undefined) {
            indices.push(v0, v1, v2)
          }
        }
      }
    })

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return geometry
  }

  const lineMaterial = new LineBasicMaterial({ color: 0x000000 })
  const lineGeometry = createLineGeometry()

  const shouldShowVertex = (
    vertex: Object['vertices'][number],
    objectOptions: Object['options']
  ) =>
    vertex.show !== undefined
      ? vertex.show
      : (objectOptions?.showVertices ?? DEFAULT_OPTIONS.showVertices)
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
      {#if object.options?.mode === 'solid' && object.faces && object.faces.length > 0}
        {@const faceGeometry = createFaceGeometry(object)}
        {#if faceGeometry}
          <T.Mesh
            geometry={faceGeometry}
            material={new MeshBasicMaterial({
              color: object.options?.color || DEFAULT_OPTIONS.color,
              transparent: true,
              opacity: 0.2,
              depthWrite: false,
              side: DoubleSide
            })}
            renderOrder={1}
          />
        {/if}
      {/if}

      {#each object.vertices as vertex}
        {#if shouldShowVertex(vertex, object.options)}
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
                depthTest={false}
                renderOrder={2000}
              />
            </Billboard>
          </T.Group>
        {/if}
      {/each}
    {/each}
  </Canvas>
</div>
