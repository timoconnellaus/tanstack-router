import { defineBuildConfig } from 'unbuild'

const dev = defineBuildConfig({
  entries: ['src/cli-entry'],
  outDir: 'dist',
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: false,
    },
  },
})

const prod = defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      cleanDist: true,
      input: './src/',
      pattern: ['**/*.{ts,tsx}', '!**/template/**'],
    },
  ],
  outDir: 'dist',
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: false,
    },
  },
})

const config = process.env.BUILD_ENV === 'production' ? prod : dev
export default config