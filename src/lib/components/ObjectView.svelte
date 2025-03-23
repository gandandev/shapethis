<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { BoxGeometry, MeshStandardMaterial } from 'three'

  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshStandardMaterial({ color: 0x6b46c1 })
</script>

<div class="h-screen w-full">
  <Canvas>
    <T.PerspectiveCamera position={[3, 3, 3]} fov={75} makeDefault>
      <OrbitControls enableZoom={true} enableDamping={true} target={[0, 0, 0]} />
    </T.PerspectiveCamera>

    <T.DirectionalLight position={[3, 3, 3]} intensity={1.5} />
    <T.AmbientLight intensity={0.5} />

    <T.Mesh {geometry} {material} />
  </Canvas>
</div>
