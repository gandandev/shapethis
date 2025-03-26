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
      ],
      faces: [
        { vertices: ['A', 'B', 'C', 'D'] }, // 윗면
        { vertices: ['E', 'F', 'G', 'H'] }, // 아랫면
        { vertices: ['A', 'B', 'F', 'E'] }, // 앞면
        { vertices: ['B', 'C', 'G', 'F'] }, // 오른쪽 면
        { vertices: ['C', 'D', 'H', 'G'] }, // 뒷면
        { vertices: ['D', 'A', 'E', 'H'] } // 왼쪽 면
      ],
      options: {
        mode: 'solid',
        color: '#3498db'
      }
    },
    {
      position: [2, 0, 0],
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
      ],
      faces: [
        { vertices: ['A', 'B', 'C', 'D'] }, // 윗면
        { vertices: ['E', 'F', 'G', 'H'] }, // 아랫면
        { vertices: ['A', 'B', 'F', 'E'] }, // 앞면
        { vertices: ['B', 'C', 'G', 'F'] }, // 오른쪽 면
        { vertices: ['C', 'D', 'H', 'G'] }, // 뒷면
        { vertices: ['D', 'A', 'E', 'H'] } // 왼쪽 면
      ],
      options: {
        mode: 'solid',
        color: 'red'
      }
    }
  ]}
/>
