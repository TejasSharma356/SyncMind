import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.join(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [react()],
});
