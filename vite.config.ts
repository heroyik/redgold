import { defineConfig } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';

const buildId = (process.env.GITHUB_SHA || pkg.version).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);

export default defineConfig({
  base: '/redgold/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${buildId}-[hash].js`,
        chunkFileNames: `assets/[name]-${buildId}-[hash].js`,
        assetFileNames: `assets/[name]-${buildId}-[hash].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [],
});
