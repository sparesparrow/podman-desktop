import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/extension.ts',
  output: {
    file: 'dist/extension.js',
    format: 'cjs',
    sourcemap: true
  },
  external: [
    '@podman-desktop/api',
    '@modelcontextprotocol/sdk/client/index.js',
    '@modelcontextprotocol/sdk/client/sse.js'
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
          sourceMap: true
        }
      }
    })
  ]
}; 