<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls, Billboard } from '@threlte/extras'
  import { LineBasicMaterial, MeshStandardMaterial, DoubleSide } from 'three'
  import { Text } from '@threlte/extras'
  import {
    getAdjustedVertexPosition,
    calculateCenter,
    createLineGeometry,
    createFaceGeometry,
    shouldShowVertex,
    type Object3D
  } from '$lib/utils/geometry'

  type Object = Object3D

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

    {#each objects as object, i (i)}
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

      {#each object.vertices as vertex, j (`${i}-${j}-${vertex.label}`)}
        {#if shouldShowVertex(vertex, object.options, DEFAULT_OPTIONS)}
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
