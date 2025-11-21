import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 👈 esto fuerza rutas relativas
  build: {
    outDir: 'dist',
  },
});
