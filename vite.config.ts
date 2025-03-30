import { sveltePhosphorOptimize } from 'phosphor-svelte/vite'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltePhosphorOptimize(), tailwindcss(), sveltekit()]
})
