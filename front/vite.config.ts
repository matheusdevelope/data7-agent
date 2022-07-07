import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: '../dist',
  },
  base: process.env.ELECTRON == 'true' ? './' : '.',
  plugins: [react()],
});
