import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  compilerOptions: {
    // Enable TypeScript type checking in Svelte components
    enableTypeCheck: true,
    // Generate TypeScript definition files
    generateTypeDeclarations: true
  }
};

export default config; 