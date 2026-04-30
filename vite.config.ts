import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/redgold/',
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