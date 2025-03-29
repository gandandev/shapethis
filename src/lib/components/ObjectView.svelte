<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import {
    LineBasicMaterial,
    BufferGeometry,
    Float32BufferAttribute,
    MeshStandardMaterial,
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
    lines?: { start: string; end: string }[]
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
    if (!objects) objects = []

    objects = objects.map((obj) => ({
      ...obj,
      options: { ...DEFAULT_OPTIONS, ...obj.options }
    }))
  })

  const getAdjustedVertexPosition = (
    vertex: [number, number, number],
    center: [number, number, number],
    objPosition: [number, number, number]
  ) => {
    return [
      vertex[0] - center[0] + objPosition[0],
      vertex[1] - center[1] + objPosition[1],
      vertex[2] - center[2] + objPosition[2]
    ] as [number, number, number]
  }

  const calculateCenter = (
    vertices: { position: [number, number, number] }[]
  ): [number, number, number] => {
    if (!vertices?.length) return [0, 0, 0]

    const sum = vertices.reduce(
      (acc, vertex) => [
        acc[0] + vertex.position[0],
        acc[1] + vertex.position[1],
        acc[2] + vertex.position[2]
      ],
      [0, 0, 0]
    )

    return [sum[0] / vertices.length, sum[1] / vertices.length, sum[2] / vertices.length]
  }

  const extractEdgesFromFace = (faceVertices: string[]): [string, string][] => {
    if (!faceVertices?.length) return []

    const edges: [string, string][] = []
    for (let i = 0; i < faceVertices.length; i++) {
      const start = faceVertices[i]
      const end = faceVertices[(i + 1) % faceVertices.length]

      const edge: [string, string] = start < end ? [start, end] : [end, start]
      edges.push(edge)
    }
    return edges
  }

  const getUniqueEdges = (object: Object): { start: string; end: string }[] => {
    if (!object?.faces?.length) return object?.lines || []

    const edgeSet = new Set<string>()
    const result: { start: string; end: string }[] = []

    for (const face of object.faces) {
      const edges = extractEdgesFromFace(face.vertices)

      for (const [start, end] of edges) {
        const edgeKey = `${start}-${end}`
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey)
          result.push({ start, end })
        }
      }
    }

    if (object.lines?.length) {
      for (const line of object.lines) {
        const [start, end] = line.start < line.end ? [line.start, line.end] : [line.end, line.start]

        const edgeKey = `${start}-${end}`
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey)
          result.push({ start, end })
        }
      }
    }

    return result
  }

  const createLineGeometry = (objects: Object[]): BufferGeometry => {
    const geometry = new BufferGeometry()
    if (!objects?.length) return geometry

    const positions: number[] = []

    for (const object of objects) {
      if (!object?.vertices?.length) continue

      const objPosition = object.position || [0, 0, 0]
      const center = calculateCenter(object.vertices)
      const vertexMap = new Map(object.vertices.map((v) => [v.label, v]))

      const edges = getUniqueEdges(object)

      for (const { start, end } of edges) {
        const startVertex = vertexMap.get(start)
        const endVertex = vertexMap.get(end)

        if (startVertex && endVertex) {
          const adjustedStart = getAdjustedVertexPosition(startVertex.position, center, objPosition)
          const adjustedEnd = getAdjustedVertexPosition(endVertex.position, center, objPosition)

          positions.push(...adjustedStart, ...adjustedEnd)
        }
      }
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return geometry
  }

  const createFaceGeometry = (object: Object): BufferGeometry | null => {
    if (!object?.faces?.length || !object?.vertices?.length) return null

    const geometry = new BufferGeometry()
    const positions: number[] = []
    const indices: number[] = []

    const objPosition = object.position || [0, 0, 0]
    const center = calculateCenter(object.vertices)

    const vertexIndices = new Map()

    object.vertices.forEach((vertex, index) => {
      const adjustedPosition = getAdjustedVertexPosition(vertex.position, center, objPosition)
      positions.push(...adjustedPosition)
      vertexIndices.set(vertex.label, index)
    })

    for (const face of object.faces) {
      if (!face.vertices?.length || face.vertices.length < 3) continue

      for (let i = 1; i < face.vertices.length - 1; i++) {
        const v0 = vertexIndices.get(face.vertices[0])
        const v1 = vertexIndices.get(face.vertices[i])
        const v2 = vertexIndices.get(face.vertices[i + 1])

        if (v0 !== undefined && v1 !== undefined && v2 !== undefined) {
          indices.push(v0, v1, v2)
        }
      }
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return geometry
  }

  const shouldShowVertex = (
    vertex: Object['vertices'][number],
    objectOptions: Object['options']
  ) =>
    vertex.show !== undefined
      ? vertex.show
      : (objectOptions?.showVertices ?? DEFAULT_OPTIONS.showVertices)

  const lineMaterial = new LineBasicMaterial({ color: 0x000000 })
</script>

<div class="h-screen w-full">
  <Canvas>
    <T.PerspectiveCamera position={[0, 2, 3]} fov={75} makeDefault>
      <OrbitControls
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.25}
        target={[0, 0, 0]}
        maxDistance={10}
      />
    </T.PerspectiveCamera>

    <T.AmbientLight intensity={1} />
    <T.DirectionalLight position={[0, 5, 0]} intensity={1} />
    <T.DirectionalLight position={[0, -5, 0]} intensity={1} />

    <T.LineSegments geometry={createLineGeometry(objects)} material={lineMaterial} />

    {#each objects as object}
      {#if object.options?.mode === 'solid' && object.faces && object.faces.length > 0}
        {@const faceGeometry = createFaceGeometry(object)}
        {#if faceGeometry}
          <T.Mesh
            geometry={faceGeometry}
            material={new MeshStandardMaterial({
              color: object.options?.color || DEFAULT_OPTIONS.color,
              transparent: true,
              opacity: 0.6,
              depthWrite: false,
              side: DoubleSide,
              envMapIntensity: 1
            })}
            renderOrder={1}
          />
        {/if}
      {/if}

      {#each object.vertices as vertex}
        {#if shouldShowVertex(vertex, object.options)}
          {@const center = calculateCenter(object.vertices)}
          {@const adjustedPosition = getAdjustedVertexPosition(
            vertex.position,
            center,
            object.position || [0, 0, 0]
          )}
          <T.Group position={[adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]]}>
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
