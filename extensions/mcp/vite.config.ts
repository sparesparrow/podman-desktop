import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import preprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess(),
      compilerOptions: {
        dev: true
      }
    }) as any
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      formats: ['cjs'],
      fileName: () => 'extension.js'
    },
    rollupOptions: {
      external: [
        '@podman-desktop/api',
        '@modelcontextprotocol/sdk',
        '@anthropic-ai/sdk',
        'better-sqlite3',
        'node:sqlite',
        'sqlite',
        'sqlite3'
      ]
    },
    sourcemap: true,
    outDir: 'dist'
  }
}); 