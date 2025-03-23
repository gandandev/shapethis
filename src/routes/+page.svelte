<script>
  import ObjectView from '$lib/components/ObjectView.svelte'
</script>

<ObjectView
  vertices={[
    { position: [-0.5, -0.5, -0.5], label: 'E' },
    { position: [0.5, -0.5, -0.5], label: 'H' },
    { position: [-0.5, 0.5, -0.5], label: 'A' },
    { position: [0.5, 0.5, -0.5], label: 'D' },
    { position: [-0.5, -0.5, 0.5], label: 'F' },
    { position: [0.5, -0.5, 0.5], label: 'G' },
    { position: [-0.5, 0.5, 0.5], label: 'B' },
    { position: [0.5, 0.5, 0.5], label: 'C' }
  ]}
  lines={[
    // 아랫면
    { start: 0, end: 1 },
    { start: 0, end: 2 },
    { start: 1, end: 3 },
    { start: 2, end: 3 },
    // 윗면
    { start: 4, end: 5 },
    { start: 4, end: 6 },
    { start: 5, end: 7 },
    { start: 6, end: 7 },
    // 옆 모서리
    { start: 0, end: 4 },
    { start: 1, end: 5 },
    { start: 2, end: 6 },
    { start: 3, end: 7 }
  ]}
/>
