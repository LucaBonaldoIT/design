import { defineConfig } from 'vite';
import { designSystem } from '../src/vite.js';

export default defineConfig({
  plugins: [designSystem()],
  build: { outDir: '../dist', emptyOutDir: true },
});
