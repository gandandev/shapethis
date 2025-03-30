import { BufferGeometry, Float32BufferAttribute } from 'three'

export type Vertex = {
  position: [number, number, number]
  label: string
  show?: boolean
}

export type Object3D = {
  position?: [number, number, number]
  vertices: Vertex[]
  lines?: { start: string; end: string }[]
  faces?: { vertices: string[] }[]
  options?: {
    showVertices?: boolean
    mode?: 'wireframe' | 'solid'
    color?: string
  }
}

export const getAdjustedVertexPosition = (
  vertex: [number, number, number],
  center: [number, number, number],
  objPosition: [number, number, number]
): [number, number, number] => {
  return [
    vertex[0] - center[0] + objPosition[0],
    vertex[1] - center[1] + objPosition[1],
    vertex[2] - center[2] + objPosition[2]
  ]
}

export const calculateCenter = (
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

export const extractEdgesFromFace = (faceVertices: string[]): [string, string][] => {
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

export const getUniqueEdges = (object: Object3D): { start: string; end: string }[] => {
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

export const createLineGeometry = (objects: Object3D[]): BufferGeometry => {
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

export const createFaceGeometry = (object: Object3D): BufferGeometry | null => {
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

export const shouldShowVertex = (
  vertex: Vertex,
  objectOptions?: Object3D['options'],
  defaultOptions = { showVertices: true }
) =>
  vertex.show !== undefined
    ? vertex.show
    : (objectOptions?.showVertices ?? defaultOptions.showVertices)
