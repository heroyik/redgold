import { defineConfig } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  base: '/redgold/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [],
});