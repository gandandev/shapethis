<script>
  import ObjectView from '$lib/components/ObjectView.svelte'
</script>

<ObjectView
  objects={[
    {
      position: [0, 0, 0],
      vertices: [
        { position: [0, 1, 0], label: 'A' },
        { position: [0, 1, 1], label: 'B' },
        { position: [1, 1, 1], label: 'C' },
        { position: [1, 1, 0], label: 'D' },
        { position: [0, 0, 0], label: 'E' },
        { position: [0, 0, 1], label: 'F' },
        { position: [1, 0, 1], label: 'G' },
        { position: [1, 0, 0], label: 'H' }
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
        { position: [0, 1, 0], label: 'A' },
        { position: [0, 1, 1], label: 'B' },
        { position: [1, 1, 1], label: 'C' },
        { position: [1, 1, 0], label: 'D' },
        { position: [0, 0, 0], label: 'E' },
        { position: [0, 0, 1], label: 'F' },
        { position: [1, 0, 1], label: 'G' },
        { position: [1, 0, 0], label: 'H' }
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
