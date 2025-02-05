import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  build: {
    lib: {
      entry: resolve(PACKAGE_ROOT, 'src/index.ts'),
      name: '@podman-desktop-mcp/shared',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['@modelcontextprotocol/sdk'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    },
    sourcemap: true,
    outDir: 'dist'
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/*.test.ts']
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
}); 