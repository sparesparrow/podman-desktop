/**
 * Vite configuration for the MCP extension.
 * This configuration uses the Svelte plugin and builds a CommonJS library.
 * Settings are optimized for clarity and accessibility.
 */
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable development mode for clearer error messages.
        dev: true
      }
    })
  ],
  build: {
    lib: {
      // The entry point for the extension.
      entry: resolve(__dirname, 'src/extension.ts'),
      // Build as CommonJS.
      formats: ['cjs'],
      // Name of the output file.
      fileName: () => 'extension.js'
    },
    rollupOptions: {
      // Externalize specific dependencies.
      external: [
        '@podman-desktop/api',
        '@modelcontextprotocol/sdk',
        '@anthropic-ai/sdk'
      ]
    },
    // Output configuration.
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      // Alias for the source directory.
      '@': resolve(__dirname, './src')
    }
  }
}); 