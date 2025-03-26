<script>
  import ObjectView from '$lib/components/ObjectView.svelte'
</script>

<ObjectView
  objects={[
    {
      position: [0, 0, 0],
      vertices: [
        { position: [-0.5, 0.5, -0.5], label: 'A' },
        { position: [-0.5, 0.5, 0.5], label: 'B' },
        { position: [0.5, 0.5, 0.5], label: 'C' },
        { position: [0.5, 0.5, -0.5], label: 'D' },
        { position: [-0.5, -0.5, -0.5], label: 'E' },
        { position: [-0.5, -0.5, 0.5], label: 'F' },
        { position: [0.5, -0.5, 0.5], label: 'G' },
        { position: [0.5, -0.5, -0.5], label: 'H' }
      ],
      lines: [
        // 아랫면
        { start: 'A', end: 'B' },
        { start: 'B', end: 'C' },
        { start: 'C', end: 'D' },
        { start: 'D', end: 'A' },
        // 윗면
        { start: 'E', end: 'F' },
        { start: 'F', end: 'G' },
        { start: 'G', end: 'H' },
        { start: 'H', end: 'E' },
        // 옆 모서리
        { start: 'A', end: 'E' },
        { start: 'B', end: 'F' },
        { start: 'C', end: 'G' },
        { start: 'D', end: 'H' }
      ]
    },
    {
      position: [2, 0, 0],
      vertices: [
        { position: [-0.5, 0.5, -0.5], label: 'I' },
        { position: [-0.5, 0.5, 0.5], label: 'J' },
        { position: [0.5, 0.5, 0.5], label: 'K' },
        { position: [0.5, 0.5, -0.5], label: 'L' },
        { position: [-0.5, -0.5, -0.5], label: 'M' },
        { position: [-0.5, -0.5, 0.5], label: 'N' },
        { position: [0.5, -0.5, 0.5], label: 'O' },
        { position: [0.5, -0.5, -0.5], label: 'P' }
      ],
      lines: [
        // 아랫면
        { start: 'I', end: 'J' },
        { start: 'J', end: 'K' },
        { start: 'K', end: 'L' },
        { start: 'L', end: 'I' },
        // 윗면
        { start: 'M', end: 'N' },
        { start: 'N', end: 'O' },
        { start: 'O', end: 'P' },
        { start: 'P', end: 'M' },
        // 옆 모서리
        { start: 'I', end: 'M' },
        { start: 'J', end: 'N' },
        { start: 'K', end: 'O' },
        { start: 'L', end: 'P' }
      ]
    }
  ]}
/>
