/**
 * Vitest configuration for the MCP extension.
 * This configuration sets up testing with global variables,
 * uses a Node environment, and specifies a setup file.
 */
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  test: {
    // Use Vitest global APIs.
    globals: true,
    // Set the test environment to Node.
    environment: 'node',
    // Specify the setup file for tests.
    setupFiles: ['src/test/setup.ts'],
    // Include test files matching .spec.ts.
    include: ['src/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      // Exclude these directories from coverage.
      exclude: ['node_modules/', 'src/test/']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@podman-desktop/api': resolve(__dirname, '../../packages/extension-api/src/api'),
      '@modelcontextprotocol/sdk': resolve(__dirname, '../../packages/modelcontextprotocol-sdk/src/sdk'),
      '@anthropic-ai/sdk': resolve(__dirname, '../../packages/anthropic-sdk/src/sdk')
    }
  }
}); 