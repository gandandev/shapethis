<script lang="ts">
  import { Camera, Images } from 'phosphor-svelte'
  import Logo from '$lib/components/Logo.svelte'
</script>

<div class="flex h-dvh w-full flex-col p-4">
  <div class="grow"></div>

  <Logo size={40} />

  <div class="grow"></div>

  <div class="grid grid-cols-2 gap-4">
    <label
      class="flex flex-col items-center gap-1 rounded-2xl bg-black p-4 font-semibold text-white"
    >
      <input type="file" accept="image/*" capture="environment" hidden />
      <Camera size={24} weight="fill" />
      바로 찍기
    </label>
    <label class="flex flex-col items-center gap-1 rounded-2xl bg-gray-100 p-4">
      <input type="file" accept="image/*" hidden />
      <Images size={24} weight="fill" />
      사진 불러오기
    </label>
  </div>
</div>
